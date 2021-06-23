'use strict';

let instruments = {};

export function addInstrumentToScheduler(name, instrument) {
    instruments[name] = instrument;
}

export function schedule(instrumentsToSchedule, time) {
    instrumentsToSchedule.forEach((instrumentName) => instruments[instrumentName].schedule(time));
}
