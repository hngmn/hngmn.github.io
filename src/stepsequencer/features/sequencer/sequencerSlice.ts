'use strict';

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { INormalizedObject } from '../../global';
import { AppDispatch, RootState } from '../../app/store';
import {
    getAudioContext,
    addInstrumentToScheduler,
    getInstrument,
    scheduleInstrument,
} from '../instruments/instrumentPlayer.js';
import { instrumentAdded } from '../instruments/instrumentsSlice';

interface ISliceState {
    nBars: number,
    beatsPerBar: number,
    padsPerBeat: number,

    pads: INormalizedObject<Array<boolean>>,

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
            reducer(state, action: PayloadAction<{ instrumentName: string, padi: number }>) {
                const {
                    instrumentName,
                    padi,
                } = action.payload;

                state.pads.byId[instrumentName][padi] = !state.pads.byId[instrumentName][padi];
            },

            prepare(instrumentName: string, padi: number) {
                return {
                    payload: { instrumentName, padi }
                };
            },
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
            const totalNotes = calculateTotalPads(nBars, beatsPerBar, padsPerBeat);

            const {
                name,
            } = action.payload;

            state.pads.allIds.push(name);
            state.pads.byId[name] = (new Array(totalNotes)).fill(false); 
        })
    },
});


/////////////////////////////
// Thunks for side effects //
/////////////////////////////

// thunk for scheduling
export function playThunk(dispatch: AppDispatch, getState: any) {
    // Constants
    const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in ms)
    const SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)

    // update UI
    dispatch(sequencerSlice.actions.play());

    const audioCtx = getAudioContext();

    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    let currentNote = 0;
    let nextNoteTime = audioCtx.currentTime;
    let timerId = null;
    let lastTime = audioCtx.currentTime;

    function schedule() {
        const {
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
        const intervalEnd = audioCtx.currentTime + SCHEDULEAHEADTIME;

        while (nextNoteTime < intervalEnd) {
            instruments.allIds.forEach((instrumentName: string) => {
                if (pads.byId[instrumentName][currentNote]) {
                    scheduleInstrument(instrumentName, nextNoteTime);
                }
            });

            currentNote = (currentNote + 1) % nPads;
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

// pad names (instrument ids)
export const selectPadNames = (state: RootState) => state.sequencer.pads.allIds;

export const selectPad = (state: RootState, instrumentName: string, padi: number) => state.sequencer.pads.byId[instrumentName][padi];


// Auto-generated Actions //

export const {
    pause,
    setTempo,

    padClick,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
