'use strict';

import { createSlice } from '@reduxjs/toolkit'

import { Sweep, Pulse, Noise, Sample } from './instruments';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
export const audioCtx = new AudioContext();

// Constants
const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in milliseconds)
const SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {

        // instruments TODO: These should eventually be moved elsewhere/configurable
        sweep: new Sweep(audioCtx),
        pulse: new Pulse(audioCtx),
        noise: new Noise(audioCtx),
        sample: new Sample(audioCtx),

        // currently fixed, will be configurable state eventually
        nBars: 1,
        notesPerBar: 4,

        // timekeeping state
        currentNote: 0,
        nextNoteTime: 0.0,
        tempo: 60, // bpm (beats/bars per min)
        timerId: null,
    },

    reducers: {
        helloAsync: () => {
            // nothing. saga watches for this
        },

        printHelloAction: () => {
            console.log('hello!');
        },

        play: state => {
            state.isPlaying = true;

            // check if context is in suspended state (autoplay policy)
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        },

        pause: state => {
            state.isPlaying = false;

            window.clearInterval(state.timerId);
        },

        advanceNote: state => {
            const {
                nBars,
                notesPerBar,

                tempo,
                currentNote,
                nextNoteTime,
            } = state.sequencer;

            const maxNotes = nBars * notesPerBar
            state.sequencer.currentNote = (currentNote + 1) % maxNotes;

            const secondsPerBeat = 60.0 / tempo;
            state.sequencer.nextNoteTime += secondsPerBeat / notesPerBar;
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
