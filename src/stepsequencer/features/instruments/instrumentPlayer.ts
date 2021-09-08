'use strict';

import * as Tone from 'tone';

import { createEmpty3DArray } from '../../util/util';
import type {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from './classes';
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

function hasInstrument(instrumentId: string) {
    return instrumentId in instruments;
}

function getInstrument(instrumentId: string) {
    return instruments[instrumentId];
}


// Player controls //

function play() {
    Tone.Transport.start('+0.05');
}

function pause() {
    Tone.Transport.stop('+0.05');
}

function setTempo(tempo: number) {
    Tone.Transport.bpm.value = tempo;
}

function setLoopBars(nBars: number) {
    Tone.Transport.setLoopPoints(0, `${nBars}m`);
}

function clearLoops() {
    for (let bari = 0; bari < loopIds.length; bari++) {
        for (let beati = 0; beati < loopIds[0].length; beati++) {
            for (let padi = 0; padi < loopIds[0][0].length; padi++) {
                Tone.Transport.clear(loopIds[bari][beati][padi]);
            }
        }
    }
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
    if (loopIds) {
        clearLoops();
    }

    loopIds = createEmpty3DArray<number>(nBars, beatsPerBar, padsPerBeat, -1);

    for (let bari = 0; bari < nBars; bari++) {
        for (let beati = 0; beati < beatsPerBar; beati++) {
            for (let padi = 0; padi < padsPerBeat; padi++) {
                loopIds[bari][beati][padi] = Tone.Transport.schedule(
                    time => {
                        const note: NoteTime = [bari, beati, padi];

                        // schedule instruments that have the current pad on
                        getInstrumentsForNote(note).forEach(
                            (instrumentId) => instruments[instrumentId].schedule(time));

                        // schedule setNote to update UI
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

function playInstrument(instrumentId: string) {
    instruments[instrumentId].schedule('+0.05');
}

export default {
    init,
    getCurrentTime,
    getTone,
    addInstrumentToScheduler,
    removeInstrumentFromScheduler,
    hasInstrument,
    getInstrument,
    setUpLoops,
    setLoopBars,
    playInstrument,
    play,
    pause,
    setTempo,
};
