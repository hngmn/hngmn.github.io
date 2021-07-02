'use strict';

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { INormalizedObject } from '../../global';
import { AppDispatch, RootState } from '../../app/store';
import instrumentPlayer from '../instruments/instrumentPlayer';
import { instrumentAdded } from '../instruments/instrumentsSlice';

interface ISliceState {
    nBars: number,
    beatsPerBar: number,
    padsPerBeat: number,

    pads: INormalizedObject<Array<Array<Array<boolean>>>>,

    isPlaying: boolean,
    tempo: number,
    timerId: number,
}

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {

        // currently fixed, will be configurable state eventually
        nBars: 1,
        beatsPerBar: 4,
        padsPerBeat: 4,

        // sequencer pad state
        pads: {
            byId: {},
            allIds: [],
        },

        // timekeeping state
        isPlaying: false,
        tempo: 60, // bpm (beats/bars per min)
        timerId: 0,
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

        padClick: {
            reducer(state, action: PayloadAction<{ instrumentName: string, bari: number, beati: number, padi: number }>) {
                const {
                    instrumentName,
                    bari,
                    beati,
                    padi,
                } = action.payload;

                state.pads.byId[instrumentName][bari][beati][padi] = !state.pads.byId[instrumentName][bari][beati][padi];
            },

            prepare(instrumentName: string, bari: number, beati: number, padi: number) {
                return {
                    payload: { instrumentName, bari, beati, padi }
                };
            },
        },

        clearAllPads: (state) => {
            const {
                nBars,
                beatsPerBar,
                padsPerBeat,
            } = state;
            state.pads.allIds.forEach((instrumentName) => {
                for (let bari = 0; bari < nBars; bari++) {
                    for (let beati = 0; beati < beatsPerBar; beati++) {
                        for (let padi = 0; padi < padsPerBeat; padi++) {
                            state.pads.byId[instrumentName][bari][beati][padi] = false;
                        }
                    }
                }
            });
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
                name,
            } = action.payload;

            state.pads.allIds.push(name);
            state.pads.byId[name] = (new Array(nBars)).fill(
                (new Array(beatsPerBar)).fill(
                    (new Array(padsPerBeat)).fill(false)
                )
            );
        })
    },
});


/////////////////////////////
// Thunks for side effects //
/////////////////////////////

// thunk for scheduling
export async function playThunk(dispatch: AppDispatch, getState: any) {
    // Constants
    const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in ms)
    const SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)

    // update UI
    dispatch(sequencerSlice.actions.play());

    let currentBar = 0;
    let currentBeat = 0;
    let currentPad = 0;
    let nextNoteTime = instrumentPlayer.getCurrentTime();
    let timerId = null;
    let lastTime = instrumentPlayer.getCurrentTime();

    function schedule() {
        const {
            nBars,
            beatsPerBar,
            padsPerBeat,

            isPlaying,
            tempo,
            pads,
        } = getState().sequencer;
        const {
            instruments,
        } = getState().instruments;

        const nPads = selectNumberOfPads(getState());
        if (!isPlaying) {
            // sequencer has been paused. stop scheduling
            console.log('isPlaying false. stopping schedule() timeout');
            return;
        }

        const secondsPerPad = 60.0 / tempo / padsPerBeat;
        const intervalEnd = instrumentPlayer.getCurrentTime() + SCHEDULEAHEADTIME;

        while (nextNoteTime < intervalEnd) {
            instruments.allIds.forEach((instrumentName: string) => {
                if (pads.byId[instrumentName][currentBar][currentBeat][currentPad]) {
                    instrumentPlayer.scheduleInstrument(instrumentName, nextNoteTime);
                }
            });

            // TODO: clean this up
            currentPad = (currentPad + 1) % padsPerBeat;
            if (currentPad === 0) {
                currentBeat = (currentBeat + 1) % beatsPerBar;
                if (currentBeat === 0) {
                    currentBar = (currentBar + 1) % nBars;
                }
            }
            nextNoteTime += secondsPerPad;
        }

        timerId = window.setTimeout(schedule, LOOKAHEAD);
    }

    console.log('starting schedule()');
    schedule();
}


///////////////
// Selectors //
///////////////

// # pads per instrument
function calculateTotalPads(nBars: number, beatsPerBar: number, padsPerBeat: number) {
    return nBars * beatsPerBar * padsPerBeat;
}
export const selectNumberOfPads = (state: RootState) => calculateTotalPads(state.sequencer.nBars, state.sequencer.beatsPerBar, state.sequencer.padsPerBeat);

export const selectNBars = (state: RootState) => state.sequencer.nBars;
export const selectBeatsPerBar = (state: RootState) => state.sequencer.beatsPerBar;
export const selectPadsPerBeat = (state: RootState) => state.sequencer.padsPerBeat;

// pad names (instrument ids)
export const selectPadNames = (state: RootState) => state.sequencer.pads.allIds;

export const selectPad = (state: RootState, instrumentName: string, bari: number, beati: number, padi: number) => state.sequencer.pads.byId[instrumentName][bari][beati][padi];


// Auto-generated Actions //

export const {
    pause,
    setTempo,

    padClick,
    clearAllPads,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
