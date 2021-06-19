'use strict';

import { createSlice } from '@reduxjs/toolkit'

import { Sweep, Pulse, Noise, Sample } from './instruments';
import { audioCtx } from './sagas';

// instruments TODO: These should eventually be moved elsewhere/configurable
export const instruments = {
    sweep: new Sweep(audioCtx),
    pulse: new Pulse(audioCtx),
    noise: new Noise(audioCtx),
    sample: new Sample(audioCtx),
};

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {

        // currently fixed, will be configurable state eventually
        nBars: 1,
        notesPerBar: 4,

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
            } = state.sequencer;

            const maxNotes = nBars * notesPerBar
            state.sequencer.currentNote = (currentNote + 1) % maxNotes;
        },

        setTempo: (state, action) => {
            state.tempo = action.payload;
        },
    }
});

// auto generated actions
export const {
    play,
    pause,
    setTempo,
    advanceNote,
} = sequencerSlice.actions;

// selectors
export const selectIsPlaying = state => state.sequencer.isPlaying;
export const selectTempo = state => state.sequencer.tempo;
export const selectSweep = state => state.sequencer.sweep;
export const selectPulse = state => state.sequencer.pulse;
export const selectNoise = state => state.sequencer.noise;
export const selectSample = state => state.sequencer.sample;

export default sequencerSlice.reducer;
