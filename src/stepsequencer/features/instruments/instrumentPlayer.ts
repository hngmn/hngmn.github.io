'use strict';

import * as Tone from 'tone';

import type {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from './types';
import type { NoteTime } from '../sequencer/types';

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

function addInstrumentToScheduler(instrument: IInstrument) {
    instruments[instrument.getUuid()] = instrument;
}

function removeInstrumentFromScheduler(name: string) {
    const i = instruments[name];
    delete instruments[name];
    return i;
}

function getInstrument(instrumentId: string) {
    return instruments[instrumentId];
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
    getInstrumentsForNote: (note: NoteTime) => Array<string>,
    setNoteCallback: (note: NoteTime) => void,
) {
    loopIds = (new Array(nBars)).fill(
        (new Array(beatsPerBar)).fill(
            (new Array(padsPerBeat)).fill(undefined)));

    for (let bari = 0; bari < nBars; bari++) {
        for (let beati = 0; beati < beatsPerBar; beati++) {
            for (let padi = 0; padi < padsPerBeat; padi++) {
                loopIds[bari][beati][padi] = Tone.Transport.schedule(
                    time => {
                        const note: NoteTime = [bari, beati, padi];
                        getInstrumentsForNote(note).forEach(
                            (instrumentId) => instruments[instrumentId].schedule(time));
                            Tone.Draw.schedule(() => {
                                setNoteCallback(note);
                            }, time);
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
