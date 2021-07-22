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
let loopIds: Array<Array<Array<number>>>;

async function init() {
    await Tone.start();
    Tone.Transport.bpm.value = 99;
    Tone.Transport.setLoopPoints(0, '2m');
    Tone.Transport.loop = true;
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

function setLoopBars(nBars: number) {
    Tone.Transport.setLoopPoints(0, `${nBars}m`);
}

/**
 * Setup a Tone.Loop per pad. Each loop will will fetch all instruments enabled for its corresponding pad (via the
 * getInstrumentsForNote callback) and schedule each one.
 */
function setUpLoops(
    nBars: number,
    beatsPerBar: number,
    padsPerBeat: number,
    getInstrumentsForNote: (bari: number, beati: number, padi: number) => Array<string>
) {
    loopIds = (new Array(nBars)).fill(
        (new Array(beatsPerBar)).fill(
            (new Array(padsPerBeat)).fill(undefined)));

    for (let bari = 0; bari < nBars; bari++) {
        for (let beati = 0; beati < beatsPerBar; beati++) {
            for (let padi = 0; padi < padsPerBeat; padi++) {
                loopIds[bari][beati][padi] = Tone.Transport.schedule(
                    time => {
                        console.log(`tone scheduled event ${bari}:${beati}:${padi}`);
                        getInstrumentsForNote(bari, beati, padi).forEach(
                            (instrumentName) => instruments[instrumentName].schedule(time));
                    },
                    `${bari}:${beati}:${padi}`
                );
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
    setLoopBars: setLoopBars,
    play: play,
    pause: pause,
    setTempo: setTempo,
};
