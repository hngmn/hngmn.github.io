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
        const c4 = Note.from('C4');
        const e4 = c4.M3();
        const g4 = e4.m3();
        this.playNote(c4.octave(-1));
        this.playNote(c4);
        this.playNote(e4);
        this.playNote(g4);
    }

    playNote(note: Note): void {
        const now = Tone.now();
        this.synth.triggerAttack(note.toString(), now)
        this.notesPlaying.push(note);
    }

    stop(): void {
        this.synth.triggerRelease(this.notesPlaying.map(n => n.toString()), Tone.now());
        this.notesPlaying = [];
    }
}
