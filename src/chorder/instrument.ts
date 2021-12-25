'use strict';

import * as Tone from 'tone';

import Note from './Note';

export default class Instrument {
    synth: Tone.PolySynth
    note: number;

    notesPlaying: Array<Note>;

    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
	this.note = -1;
	this.notesPlaying = [];
    }

    setNote(n: number): void {
	this.note = n;
	this.notesPlaying = []; // TODO
    }

    unsetNote(): void {
	this.note = -1;
    }

    play(): void {
        const now = Tone.now();
        const c4 = Note.from('C4');
        this.synth.triggerAttack(c4.toString(), now)
    }

    stop(): void {
        this.synth.triggerRelease(['C4', 'E4', 'G3'], Tone.now());
    }
}
