'use strict';

import { createSlice } from '@reduxjs/toolkit'

import { getAudioContext, addInstrumentToScheduler, scheduleInstrument } from './instrumentPlayer.js';

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {

        // currently fixed, will be configurable state eventually
        nBars: 1,
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

                const {
                    name,
                    params,
                } = action.payload;

                let id = name;

                state.instruments.allIds.push(id);
                state.instruments.byId[id] = {
                    name: name,
                    pads: [false, false, false, false],
                    params: {
                        byName: {
                        },
                        allNames: params.map((param) => param.name),
                    }
                };

                params.forEach((param) => {
                    state.instruments.byId[id].params.byName[param.name] = param;
                });

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

        updateInstrumentParameter: {
            reducer(state, action) {
                const {
                    instrumentName,
                    parameterName,
                    value,
                } = action.payload;

                state.instruments.byId[instrumentName].params.byName[parameterName].value = value;
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
    }
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
            window.clearTimeout(timerId);
            return;
        }

        const secondsPerBeat = 60.0 / tempo;
        const intervalEnd = audioCtx.currentTime + SCHEDULEAHEADTIME;

        while (nextNoteTime < intervalEnd) {
            console.log(`scheduling note ${currentNote}`);
            instruments.allIds.forEach((instrumentName) => {
                if (instruments.byId[instrumentName].pads[currentNote]) {
                    console.log(`scheduling instrument ${instrumentName} for note ${currentNote}`);
                    scheduleInstrument(instrumentName, nextNoteTime);
                }
            });

            currentNote = (currentNote + 1) % maxNotes;
            nextNoteTime += secondsPerBeat;
        }
    }

    console.log('starting schedule()');
    timerId = window.setInterval(schedule, LOOKAHEAD);
}

// auto generated actions
export const {
    pause,
    setTempo,
    advanceNote,

    updateInstrumentParameter,
    padClick,
} = sequencerSlice.actions;

// selectors
export const selectIsPlaying = state => state.sequencer.isPlaying;
export const selectTempo = state => state.sequencer.tempo;
export const selectInstruments = state => state.sequencer.instruments.allIds.map((id) => state.sequencer.instruments.byId[id]);

export default sequencerSlice.reducer;
