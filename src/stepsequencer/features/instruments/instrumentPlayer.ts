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
    instruments[instrumentName].schedule(time);
}

let loops: Array<Array<Array<Tone.Loop>>>;
function setUpLoops(nBars: number, beatsPerBar: number, padsPerBeat: number, getInstrumentsForNote: (bari: number, beati: number, padi: number) => Array<string>) {

    loops = (new Array(nBars)).fill(
        (new Array(beatsPerBar)).fill(
            (new Array(padsPerBeat)).fill(false)));

    for (let bari = 0; bari < nBars; bari++) {
        for (let beati = 0; beati < beatsPerBar; beati++) {
            for (let padi = 0; padi < padsPerBeat; padi++) {
                loops[bari][beati][padi] = new Tone.Loop(
                    time => {
                        getInstrumentsForNote(bari, beati, padi).forEach((instrumentName) => scheduleInstrument(instrumentName, time));
                    },
                    `${nBars}m`
                ).start(`${bari}:${beati}:${padi}`);
            }
        }
    }
}

function play() {
    Tone.Transport.start();
}

function pause() {
    Tone.Transport.stop();
}

function setTempo(tempo: number) {
    Tone.Transport.bpm.value = tempo;
}

export default {
    init: init,
    getTone: getTone,
    getCurrentTime: getCurrentTime,
    addInstrumentToScheduler: addInstrumentToScheduler,
    getInstrument: getInstrument,
    scheduleInstrument: scheduleInstrument,
    setUpLoops: setUpLoops,
    play: play,
    pause: pause,
    setTempo: setTempo,
};
