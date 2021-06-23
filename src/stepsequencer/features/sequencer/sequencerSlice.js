'use strict';

import { createSlice } from '@reduxjs/toolkit'

import { addInstrumentToScheduler } from './instrumentPlayer.js';

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
        currentNote: 0,
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

        advanceNote: state => {
            const {
                nBars,
                notesPerBar,

                currentNote,
            } = state;

            const maxNotes = nBars * notesPerBar
            state.currentNote = (currentNote + 1) % maxNotes;
        },

        setTempo: (state, action) => {
            state.tempo = action.payload;
        },

        addInstrument: {
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
                // add instrument to player
                addInstrumentToScheduler(name, instrument);

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

// auto generated actions
export const {
    play,
    pause,
    setTempo,
    advanceNote,
    addInstrument,
    updateInstrumentParameter,
    padClick,
} = sequencerSlice.actions;

// selectors
export const selectIsPlaying = state => state.sequencer.isPlaying;
export const selectTempo = state => state.sequencer.tempo;
export const selectInstruments = state => state.sequencer.instruments.allIds.map((id) => state.sequencer.instruments.byId[id]);

export default sequencerSlice.reducer;
