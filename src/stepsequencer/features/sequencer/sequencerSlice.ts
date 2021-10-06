'use strict';

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from '../../app/store';
import { createEmpty3DArray } from '../../util/util';
import * as rtm from '../../util/language/rtm';
import { instrumentStaged, instrumentUnstaged } from '../instruments/instrumentsSlice';
import instrumentPlayer from '../instruments/instrumentPlayer';

import { NoteTime } from './types';

interface ISliceState {
    isPlaying: boolean;

    // Timing
    nBars: number;
    beatsPerBar: number;
    padsPerBeat: number;
    tempo: number;
    currentNote: NoteTime;

    pads: Array<Array<Array<Record<string, boolean>>>>;
    rtms: Record<string, RtmState>;
}

interface RtmState {
    input: string;
    synced: boolean;
    valid: boolean;
    errorMessage: string;
}

const INITIAL_NBARS = 2;
const INITIAL_BEATS_PER_BAR = 4;
const INITIAL_PADS_PER_BEAT = 4;

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {
        isPlaying: false,

        // currently fixed, will be configurable state eventually
        nBars: INITIAL_NBARS,
        beatsPerBar: INITIAL_BEATS_PER_BAR,
        padsPerBeat: INITIAL_PADS_PER_BEAT,

        // timekeeping state
        tempo: 99, // bpm (beats/bars per min)
        currentNote: [0, 0, 0],

        // sequencer pad state
        pads: createEmpty3DArray<Record<string, boolean>>(INITIAL_NBARS, INITIAL_BEATS_PER_BAR, INITIAL_PADS_PER_BEAT, {}),

        // rtm states per instrument
        rtms: {},

    } as ISliceState,

    reducers: {
        play: state => {
            state.isPlaying = true;
        },

        pause: state => {
            state.isPlaying = false;
        },

        setTempo: (state, action) => {
            state.tempo = action.payload;
        },

        setNBars: (state, action) => {
            state.nBars = action.payload;
        },

        setCurrentNote: (state, action) => {
            state.currentNote = action.payload;
        },

        padClick: {
            reducer(state, action: PayloadAction<{ id: string, note: NoteTime }>) {
                const {
                    id,
                    note,
                } = action.payload;
                const [bari, beati, padi] = note;

                state.pads[bari][beati][padi][id] = !state.pads[bari][beati][padi][id];
                
                state.rtms[id].synced = false;
            },

            prepare(id: string, note: NoteTime) {
                return {
                    payload: { id, note }
                };
            },
        },

        setRtmInput: {
            reducer(state, action: PayloadAction<{ instrumentId: string, rtm: string }>) {
                const {
                    instrumentId,
                    rtm,
                } = action.payload;

                state.rtms[instrumentId].input = rtm;
            },

            prepare(instrumentId: string, rtm: string) {
                return {
                    payload: { instrumentId, rtm }
                };
            },
        },

        compileRtm: (state, action) => {
            const instrumentId = action.payload;
            const input = state.rtms[instrumentId].input;
            const {
                nBars,
                beatsPerBar,
                padsPerBeat,
            } = state;
            const nPads = calculateTotalPads(nBars, beatsPerBar, padsPerBeat);

            const result  = rtm.compile(input, nPads);

            if (result.err) {
                state.rtms[instrumentId].valid = false;
                state.rtms[instrumentId].errorMessage = result.val.message;
                return;
            }

            // update rtm state
            state.rtms[instrumentId].valid = true;
            state.rtms[instrumentId].errorMessage = '';
            state.rtms[instrumentId].synced = true;

            // set pads
            const pads = result.val;
            let padsi = 0;
            for (let bari = 0; bari < nBars; bari++) {
                for (let beati = 0; beati < beatsPerBar; beati++) {
                    for (let padi = 0; padi < padsPerBeat; padi++) {
                        state.pads[bari][beati][padi][instrumentId] = pads[padsi++];
                    }
                }
            }
        },

        clearAllPads: (state) => {
            const {
                nBars,
                beatsPerBar,
                padsPerBeat,
            } = state;

            for (let bari = 0; bari < nBars; bari++) {
                for (let beati = 0; beati < beatsPerBar; beati++) {
                    for (let padi = 0; padi < padsPerBeat; padi++) {
                        Object.keys(state.pads[bari][beati][padi]).forEach((id) => {
                            state.pads[bari][beati][padi][id] = false;
                        });
                    }
                }
            }

            for (const id of Object.keys(state.rtms)) {
                state.rtms[id].synced = false;
            }
        },
    },

    extraReducers: builder => {
        builder
        .addCase(instrumentStaged, (state, action) => {
            const {
                nBars,
                beatsPerBar,
                padsPerBeat,
            } = state;

            const {
                id,
            } = action.payload;

            for (let bari = 0; bari < nBars; bari++) {
                for (let beati = 0; beati < beatsPerBar; beati++) {
                    for (let padi = 0; padi < padsPerBeat; padi++) {
                        state.pads[bari][beati][padi][id] = false;
                    }
                }
            }

            state.rtms[id] = {
                input: '',
                synced: false,
                valid: true,
                errorMessage: '',
            };
        })

        .addCase(instrumentUnstaged, (state, action) => {
            const {
                nBars,
                beatsPerBar,
                padsPerBeat,
            } = state;

            const id = action.payload;

            for (let bari = 0; bari < nBars; bari++) {
                for (let beati = 0; beati < beatsPerBar; beati++) {
                    for (let padi = 0; padi < padsPerBeat; padi++) {
                        delete state.pads[bari][beati][padi][id];
                    }
                }
            }

            delete state.rtms[id];
        })
    },
});


/////////////////////////////
// Thunks for side effects //
/////////////////////////////

// thunk for scheduling
export function playThunk(dispatch: AppDispatch): void {
    // update UI
    dispatch(sequencerSlice.actions.play());
    instrumentPlayer.play();
}

export function pauseThunk(dispatch: AppDispatch): void {
    // update UI
    dispatch(sequencerSlice.actions.pause());
    instrumentPlayer.pause();
}

export function setTempo(tempo: number) {
    return function setTempoThunk(dispatch: AppDispatch): void {
        dispatch(sequencerSlice.actions.setTempo(tempo));
        instrumentPlayer.setTempo(tempo);
    };
}

export function setNBars(nBars: number) {
    return function setNBarsThunk(dispatch: AppDispatch): void {
        dispatch(sequencerSlice.actions.setNBars(nBars));
        instrumentPlayer.setLoopBars(nBars);
    }
}


///////////////
// Selectors //
///////////////

// Timing state
export const selectNBars = (state: RootState): number => state.sequencer.nBars;
export const selectBeatsPerBar = (state: RootState): number => state.sequencer.beatsPerBar;
export const selectPadsPerBeat = (state: RootState): number => state.sequencer.padsPerBeat;
export const selectCurrentNote = (state: RootState): NoteTime => state.sequencer.currentNote;

// # of pads per instrument
function calculateTotalPads(nBars: number, beatsPerBar: number, padsPerBeat: number) {
    return nBars * beatsPerBar * padsPerBeat;
}
export const selectNumberOfPads = (state: RootState): number => calculateTotalPads(state.sequencer.nBars, state.sequencer.beatsPerBar, state.sequencer.padsPerBeat);

// pad names (instrument ids)
export const selectPadIds = (state: RootState): Array<string> => Object.keys(state.sequencer.pads[0][0][0]);

export const selectPad = (state: RootState, iid: string, [bari, beati, padi]: NoteTime): boolean => state.sequencer.pads[bari][beati][padi][iid];

export const selectInstrumentsEnabledForPad = (state: RootState, note: NoteTime): Array<string> =>
    selectPadIds(state).filter((iid) => selectPad(state, iid, note));

// rtm states
export const selectRtmState = (state: RootState, iid: string): RtmState => state.sequencer.rtms[iid];

// Auto-generated Actions //

export const {
    setCurrentNote,

    padClick,
    clearAllPads,

    setRtmInput,
    compileRtm
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
