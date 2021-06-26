'use strict';

import { createSlice } from '@reduxjs/toolkit'

import {
    getAudioContext,
    addInstrumentToScheduler,
    getInstrument,
    scheduleInstrument,
} from './instrumentPlayer.js';

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

        // timekeeping state
        tempo: 60, // bpm (beats/bars per min)
        timerId: null,
    },

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
            reducer(state, action) {
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
                    params: {
                        byId: params,
                        allIds: Object.keys(params),
                    }
                };
            },

            prepare(name, instrument) {
                return {
                    payload: {
                        name: name,
                        params: instrument.params,
                    }
                };
            },
        },

        instrumentParameterUpdated: {
            reducer(state, action) {
                const {
                    instrumentName,
                    parameterName,
                    value,
                } = action.payload;

                state.instruments.byId[instrumentName].params.byId[parameterName].value = value;
            },

            prepare(instrumentName, parameterName, value) {
                return {
                    payload: { instrumentName, parameterName, value }
                };
            }
        },

        padClick: {
            reducer(state, action) {
                const {
                    instrumentName,
                    padi,
                } = action.payload;

                state.instruments.byId[instrumentName].pads[padi] = !state.instruments.byId[instrumentName].pads[padi];
            },

            prepare(instrumentName, padi) {
                return {
                    payload: { instrumentName, padi }
                };
            },
        },

    }
});

// thunk for adding instrument to instrumentPlayer
export function addInstrument(name, instrument) {
    return function addInstrumentThunk(dispatch, getState) {
        addInstrumentToScheduler(name, instrument);
        dispatch(sequencerSlice.actions.instrumentAdded(name, instrument));
    };
}

export function updateInstrumentParameter(instrumentName, parameterName, value) {
    const valueNumber = parseFloat(value);
    return function updateInstrumentThunk(dispatch, getState) {
        getInstrument(instrumentName).setParameter(parameterName, valueNumber);
        dispatch(sequencerSlice.actions.instrumentParameterUpdated(instrumentName, parameterName, valueNumber));
    };
}

// thunk for scheduling
export function playThunk(dispatch, getState) {
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
            instruments.allIds.forEach((instrumentName) => {
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

// auto generated actions
export const {
    pause,
    setTempo,
    advanceNote,

    padClick,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
