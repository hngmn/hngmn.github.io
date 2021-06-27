'use strict';

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { NormalizedObject } from '../../global';
import { AppDispatch, RootState } from '../../app/store';
import {
    getAudioContext,
    addInstrumentToScheduler,
    getInstrument,
    scheduleInstrument,
} from '../instruments/instrumentPlayer.js';
import { Instrument, InstrumentParameter } from '../instruments/types';

interface InstrumentConfig {
    name: string,
    params: NormalizedObject<InstrumentParameter>,
    pads: Array<boolean>,
}

interface SliceState {
    nBars: number,
    notesPerBar: number,

    instruments: NormalizedObject<InstrumentConfig>,
    pads: NormalizedObject<Array<boolean>>,

    isPlaying: boolean,
    tempo: number,
    timerId: number,
}

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {

        // currently fixed, will be configurable state eventually
        nBars: 2,
        notesPerBar: 4,

        // sequencer instrument state
        instruments: {
            byId: {},
            allIds: [],
        },
        pads: {
            byId: {},
            allIds: [],
        },

        // timekeeping state
        isPlaying: false,
        tempo: 60, // bpm (beats/bars per min)
        timerId: 0,
    } as SliceState,

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

        instrumentAdded: {
            reducer(state, action: PayloadAction<{ name: string, params: NormalizedObject<InstrumentParameter> }>) {
                const {
                    nBars,
                    notesPerBar,
                } = state;
                const totalNotes = nBars * notesPerBar;

                const {
                    name,
                    params,
                } = action.payload;

                let id = name;

                state.instruments.allIds.push(id);
                state.instruments.byId[id] = {
                    name: name,
                    pads: (new Array(totalNotes)).fill(false),
                    params: params,
                };

                state.pads.allIds.push(id);
                state.pads.byId[id] = (new Array(totalNotes)).fill(false); 
            },

            prepare(name: string, instrument: Instrument) {
                return {
                    payload: {
                        name: name,
                        params: instrument.params,
                    }
                };
            },
        },

        instrumentParameterUpdated: {
            reducer(state, action: PayloadAction<{ instrumentName: string, parameterName: string, value: number }>) {
                const {
                    instrumentName,
                    parameterName,
                    value,
                } = action.payload;

                state.instruments.byId[instrumentName].params.byId[parameterName].value = value;
            },

            prepare(instrumentName: string, parameterName: string, value: number) {
                return {
                    payload: { instrumentName, parameterName, value }
                };
            }
        },

        padClick: {
            reducer(state, action: PayloadAction<{ instrumentName: string, padi: number }>) {
                const {
                    instrumentName,
                    padi,
                } = action.payload;

                state.instruments.byId[instrumentName].pads[padi] = !state.instruments.byId[instrumentName].pads[padi];

                state.pads.byId[instrumentName][padi] = !state.pads.byId[instrumentName][padi];
            },

            prepare(instrumentName: string, padi: number) {
                return {
                    payload: { instrumentName, padi }
                };
            },
        },

    }
});


/////////////////////////////
// Thunks for side effects //
/////////////////////////////

// thunk for adding instrument to instrumentPlayer
export function addInstrument(name: string, instrument: Instrument) {
    return function addInstrumentThunk(dispatch: AppDispatch, getState: any) {
        addInstrumentToScheduler(name, instrument);
        dispatch(sequencerSlice.actions.instrumentAdded(name, instrument));
    };
}

export function updateInstrumentParameter(instrumentName: string, parameterName: string, value: number) {
    return function updateInstrumentThunk(dispatch: AppDispatch, getState: any) {
        getInstrument(instrumentName).setParameter(parameterName, value);
        dispatch(sequencerSlice.actions.instrumentParameterUpdated(instrumentName, parameterName, value));
    };
}

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
            nBars,
            notesPerBar,

            isPlaying,
            tempo,
            instruments,
        } = getState().sequencer;

        const maxNotes = nBars * notesPerBar
        if (!isPlaying) {
            // sequencer has been paused. stop scheduling
            console.log('isPlaying false. stopping schedule() timeout');
            return;
        }

        const secondsPerBeat = 60.0 / tempo;
        const intervalEnd = audioCtx.currentTime + SCHEDULEAHEADTIME;

        while (nextNoteTime < intervalEnd) {
            instruments.allIds.forEach((instrumentName: string) => {
                if (instruments.byId[instrumentName].pads[currentNote]) {
                    scheduleInstrument(instrumentName, nextNoteTime);
                }
            });

            currentNote = (currentNote + 1) % maxNotes;
            nextNoteTime += secondsPerBeat;
        }

        timerId = window.setTimeout(schedule, LOOKAHEAD);
    }

    console.log('starting schedule()');
    schedule();
}


///////////////
// Selectors //
///////////////

// instrument names (in order)
export const selectInstrumentNames = (state: RootState) => state.sequencer.instruments.allIds;

// config for given instrument id
export const selectInstrumentConfig = (state: RootState, instrumentName: string) => state.sequencer.instruments.byId[instrumentName];

// all instrument configs (in order)
export const selectInstrumentConfigs = createSelector(
    [
        selectInstrumentNames,
        (state) => state.sequencer.instruments.byId,
    ],
    (instrumentNames, byId) => instrumentNames.map(iname => byId[iname])
);

// parameter names (in order) for given instrument id
export const selectParameterNamesForInstrument = (state: RootState, instrumentName: string) => state.sequencer.instruments.byId[instrumentName].params.allIds;

// given instrument, parameter
export const selectInstrumentParameter = (state: RootState, instrumentName: string, parameterName: string) => state.sequencer.instruments.byId[instrumentName].params.byId[parameterName];

// # pads per instrument
export const selectNumberOfBeats = (state: RootState) => state.sequencer.nBars * state.sequencer.notesPerBar;

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
