'use strict';

import { createSlice } from '@reduxjs/toolkit'

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

        addInstrument: (state, action) => {
            console.log('addInstrument action');
            const {
                nBars,
                notesPerBar,
            } = state;

            let id = `instrument${state.instruments.allIds.length}`; // TODO this should probably be uuid

            state.instruments.allIds.push(id);
            state.instruments.byId[id] = {
                name: action.payload.name,
                pads: [false, false, false, false],
                params: {
                    byName: {
                    },
                    allNames: action.payload.params.map((param) => param.name),
                }
            };

            action.payload.params.forEach((param) => {
                state.instruments.byId[id].params.byName[param.name] = param;
            });

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
} = sequencerSlice.actions;

// selectors
export const selectIsPlaying = state => state.sequencer.isPlaying;
export const selectTempo = state => state.sequencer.tempo;
export const selectInstruments = state => state.sequencer.instruments.allIds.map((id) => state.sequencer.instruments.byId[id]);

export default sequencerSlice.reducer;
