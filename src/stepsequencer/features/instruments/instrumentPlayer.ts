'use strict';

import * as Tone from 'tone';

import type {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from './types';

// instruments
let instruments: Record<string, IInstrument> = {};

/**
 * One Tone.Loop per pad/note, to play all instruments with the corresponding pad on.
 */
let loops: Array<Array<Array<Tone.Loop>>>;

async function init(bpm: number) {
    await Tone.start();
    Tone.Transport.bpm.value = bpm;
}

function getCurrentTime(): number {
    return Tone.now();
}

function getTone() {
    return Tone;
}


// instruments store //

function addInstrumentToScheduler(name: string, instrument: IInstrument) {
    instruments[name] = instrument;
    console.log(`instrument added: ${name}`);
}

function removeInstrumentFromScheduler(name: string) {
    const i = instruments[name];
    delete instruments[name];
    return i;
}

function getInstrument(instrumentName: string) {
    return instruments[instrumentName];
}


// Player controls //

function play() {
    Tone.Transport.start();
}

function pause() {
    Tone.Transport.stop();
}

function setTempo(tempo: number) {
    Tone.Transport.bpm.value = tempo;
}

/**
 * Setup a Tone.Loop per pad. Each loop will will fetch all instruments enabled for its corresponding pad (via the
 * getInstrumentsForNote callback) and schedule each one.
 */
function setUpLoops(nBars: number, beatsPerBar: number, padsPerBeat: number,
                    getInstrumentsForNote: (bari: number, beati: number, padi: number) => Array<string>) {
    loops = (new Array(nBars)).fill(
        (new Array(beatsPerBar)).fill(
            (new Array(padsPerBeat)).fill(false)));

    for (let bari = 0; bari < nBars; bari++) {
        for (let beati = 0; beati < beatsPerBar; beati++) {
            for (let padi = 0; padi < padsPerBeat; padi++) {
                loops[bari][beati][padi] = new Tone.Loop(
                    time => {
                        getInstrumentsForNote(bari, beati, padi).forEach(
                            (instrumentName) => instruments[instrumentName].schedule(time));
                    },
                    `${nBars}m`
                ).start(`${bari}:${beati}:${padi}`);
            }
        }
    }
}

export default {
    init: init,
    getCurrentTime: getCurrentTime,
    getTone: getTone,
    addInstrumentToScheduler: addInstrumentToScheduler,
    removeInstrumentFromScheduler: removeInstrumentFromScheduler,
    getInstrument: getInstrument,
    setUpLoops: setUpLoops,
    play: play,
    pause: pause,
    setTempo: setTempo,
};
