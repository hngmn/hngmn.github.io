'use strict';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

export function getAudioContext() {
    audioCtx = audioCtx || new AudioContext();

    return audioCtx;
}

// instruments
let instruments = {};

// TODO: currently instrument parameters can't be updated; they don't look up redux store nor is there a mechanism to
// update on updateInstrumentParameter action

export function addInstrumentToScheduler(name, instrument) {
    instruments[name] = instrument;
    console.log(`instrument added: ${name}`);
}

export function getInstrument(name) {
    return instruments[name];
}

export function scheduleInstrument(instrumentName, time) {
    // TODO: check instrument exists?
    instruments[instrumentName].schedule(time);
}
