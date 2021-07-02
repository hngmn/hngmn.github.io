'use strict';

let tone;
let audioCtx;

async function getAudioContext() {
    audioCtx = audioCtx || await initAudioContext();
    return audioCtx;
}

async function init() {
    tone = await import('tone');
    await tone.start();
    audioCtx = tone.context;
    return audioCtx;
}

function getTone() {
    return tone;
}

function getCurrentTime() {
    return tone.now();
}

// instruments
let instruments = {};

// TODO: currently instrument parameters can't be updated; they don't look up redux store nor is there a mechanism to
// update on updateInstrumentParameter action

function addInstrumentToScheduler(name, instrument) {
    instruments[name] = instrument;
    console.log(`instrument added: ${name}`);
}

function getInstrument(name) {
    return instruments[name];
}

function scheduleInstrument(instrumentName, time) {
    // TODO: check instrument exists?
    console.log(`scheduling instrument ${instrumentName} at time ${time}`);
    instruments[instrumentName].schedule(time);
}

export default {
    getAudioContext: getAudioContext,
    init: init,
    getTone: getTone,
    getCurrentTime: getCurrentTime,
    addInstrumentToScheduler: addInstrumentToScheduler,
    getInstrument: getInstrument,
    scheduleInstrument: scheduleInstrument,
};
