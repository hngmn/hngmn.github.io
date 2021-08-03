'use strict';

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import * as Tone from 'tone';

import { NoteTime } from './types';
import { INormalizedObject } from '../../global';
import { AppDispatch, RootState } from '../../app/store';
import { instrumentAdded, instrumentRemoved } from '../instruments/instrumentsSlice';
import instrumentPlayer from '../instruments/instrumentPlayer';

interface ISliceState {
    isPlaying: boolean,

    // Timing
    nBars: number,
    beatsPerBar: number,
    padsPerBeat: number,
    tempo: number,
    currentNote: NoteTime,

    pads: Array<Array<Array<Record<string, boolean>>>>,

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
        pads: (new Array(INITIAL_NBARS).fill(
            (new Array(INITIAL_BEATS_PER_BAR).fill(
                (new Array(INITIAL_PADS_PER_BEAT).fill({})))))),

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
            reducer(state, action: PayloadAction<{ instrumentName: string, note: NoteTime }>) {
                const {
                    instrumentName,
                    note,
                } = action.payload;
                const [bari, beati, padi] = note;

                state.pads[bari][beati][padi][instrumentName] = !state.pads[bari][beati][padi][instrumentName];
            },

            prepare(instrumentName: string, note: NoteTime) {
                return {
                    payload: { instrumentName, note }
                };
            },
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
                        Object.keys(state.pads[bari][beati][padi]).forEach((instrumentName) => {
                            state.pads[bari][beati][padi][instrumentName] = false;
                        });
                    }
                }
            }
        },
    },

    extraReducers: builder => {
        builder
        .addCase(instrumentAdded, (state, action) => {
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
        })

        .addCase(instrumentRemoved, (state, action) => {
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
        })
    },
});


/////////////////////////////
// Thunks for side effects //
/////////////////////////////

// thunk for scheduling
export function playThunk(dispatch: AppDispatch, getState: () => RootState) {
    // update UI
    dispatch(sequencerSlice.actions.play());
    instrumentPlayer.play();
}

export function pauseThunk(dispatch: AppDispatch, getState: () => RootState) {
    // update UI
    dispatch(sequencerSlice.actions.pause());
    instrumentPlayer.pause();
}

export function setTempo(tempo: number) {
    return function setTempoThunk(dispatch: AppDispatch, getState: () => RootState) {
        dispatch(sequencerSlice.actions.setTempo(tempo));
        instrumentPlayer.setTempo(tempo);
    };
}

export function setNBars(nBars: number) {
    return function setNBarsThunk(dispatch: AppDispatch, getSTate: () => RootState) {
        dispatch(sequencerSlice.actions.setNBars(nBars));
        instrumentPlayer.setLoopBars(nBars);
    }
}


///////////////
// Selectors //
///////////////

// Timing state
export const selectNBars = (state: RootState) => state.sequencer.nBars;
export const selectBeatsPerBar = (state: RootState) => state.sequencer.beatsPerBar;
export const selectPadsPerBeat = (state: RootState) => state.sequencer.padsPerBeat;
export const selectCurrentNote = (state: RootState) => state.sequencer.currentNote;

// # of pads per instrument
function calculateTotalPads(nBars: number, beatsPerBar: number, padsPerBeat: number) {
    return nBars * beatsPerBar * padsPerBeat;
}
export const selectNumberOfPads = (state: RootState) => calculateTotalPads(state.sequencer.nBars, state.sequencer.beatsPerBar, state.sequencer.padsPerBeat);

// pad names (instrument ids)
export const selectPadNames = (state: RootState) => Object.keys(state.sequencer.pads[0][0][0]);

export const selectPad = (state: RootState, instrumentName: string, [bari, beati, padi]: NoteTime) => state.sequencer.pads[bari][beati][padi][instrumentName];

export const selectInstrumentsEnabledForPad = (state: RootState, note: NoteTime) =>
    selectPadNames(state).filter((instrumentName) => selectPad(state, instrumentName, note));


// Auto-generated Actions //

export const {
    setCurrentNote,

    padClick,
    clearAllPads,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
