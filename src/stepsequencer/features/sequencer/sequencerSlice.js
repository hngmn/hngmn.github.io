'use strict';

import { createSlice } from '@reduxjs/toolkit'

import { Sweep, Pulse, Noise, Sample } from './instruments';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Constants
const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in milliseconds)
const SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {
        audioCtx: audioCtx,
        sweep: new Sweep(audioCtx),
        pulse: new Pulse(audioCtx),
        noise: new Noise(audioCtx),
        sample: new Sample(audioCtx),
        tempo: 60,
        timerId: null,
    },

    reducers: {
        setTempo: (state, action) => {
            state.tempo = action.payload;
        },

        play: state => {
            state.isPlaying = true;

            // check if context is in suspended state (autoplay policy)
            if (state.audioCtx.state === 'suspended') {
                state.audioCtx.resume();
            }

            state.timerId = window.setInterval(schedule, LOOKAHEAD);
        },

        pause: state => {
            state.isPlaying = false;

            window.clearInterval(state.timerId);
        }
    }
});

// auto generated actions
export const { setTempo } = sequencerSlice.actions;

// selectors
export const selectTempo = state => state.sequencer.tempo;
export const selectAudioCtx = state => state.sequencer.audioCtx;
export const selectSweep = state => state.sequencer.sweep;
export const selectPulse = state => state.sequencer.pulse;
export const selectNoise = state => state.sequencer.noise;
export const selectSample = state => state.sequencer.sample;

export default sequencerSlice.reducer;
