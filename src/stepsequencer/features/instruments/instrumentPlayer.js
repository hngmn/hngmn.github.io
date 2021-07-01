'use strict';

import * as Tone from 'tone';

let audioCtx;

export async function getAudioContext() {
    audioCtx = audioCtx || await initAudioContext();
    return audioCtx;
}

async function initAudioContext() {
    await Tone.start();
    audioCtx = Tone.context;
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
    console.log(`scheduling instrument ${instrumentName} at time ${time}`);
    instruments[instrumentName].schedule(time);
}
