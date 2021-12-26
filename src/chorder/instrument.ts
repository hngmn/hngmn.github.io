'use strict';

import * as Tone from 'tone';

import Note, { NoteString } from './Note';

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
        this.playChord('C4');
    }

    playNote(note: Note): void {
        const now = Tone.now();
        this.synth.triggerAttack(note.toString(), now)
        this.notesPlaying.push(note);
    }

    playChord(noteString: NoteString): void {
        const root = Note.from(noteString);
        const third = root.M3();
        const fifth = third.m3();
        this.playNote(root);
        this.playNote(third);
        this.playNote(fifth);
    }

    stop(): void {
        this.synth.triggerRelease(this.notesPlaying.map(n => n.toString()), Tone.now());
        this.notesPlaying = [];
    }
}
