'use strict';

import * as Tone from 'tone';

import type {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from './types';

async function init() {
    await Tone.start();
}

function getTone() {
    return Tone;
}

function getCurrentTime(): number {
    return Tone.now();
}

// instruments
let instruments: Record<string, IInstrument> = {};

// TODO: currently instrument parameters can't be updated; they don't look up redux store nor is there a mechanism to
// update on updateInstrumentParameter action

function addInstrumentToScheduler(name: string, instrument: IInstrument) {
    instruments[name] = instrument;
    console.log(`instrument added: ${name}`);
}

function getInstrument(instrumentName: string) {
    return instruments[instrumentName];
}

function scheduleInstrument(instrumentName: string, time: Tone.Unit.Time) {
    // TODO: check instrument exists?
    console.log(`scheduling instrument ${instrumentName} at time ${time}`);
    instruments[instrumentName].schedule(time);
}

export default {
    init: init,
    getTone: getTone,
    getCurrentTime: getCurrentTime,
    addInstrumentToScheduler: addInstrumentToScheduler,
    getInstrument: getInstrument,
    scheduleInstrument: scheduleInstrument,
};
