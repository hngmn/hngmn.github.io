'use strict';

import * as Tone from 'tone';

import Note from './Note';
import Scale from './Scale';

export default class Instrument {
    synth: Tone.PolySynth
    scale: Scale;
    transposition: number;

    doubleRoot: boolean;

    notesPlaying: Array<Note>;

    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
	this.notesPlaying = [];
        this.scale = Scale.CMAJOR;
        this.transposition = 0;
        this.doubleRoot = false;
    }

    play(): void {
        this.playChord(1);
    }

    playNote(note: Note): void {
        const now = Tone.now();
        this.synth.triggerAttack(note.noteString(), now)
        this.notesPlaying.push(note);
    }

    playNotes(notes: Array<Note>): void {
        notes.forEach(note => this.playNote(note));
    }

    playChord(degree: number): Array<Note> {
        console.log(`chord: ${degree}`);
        const root = this.scale.at(degree);
        const third = this.scale.at(degree+2);
        const fifth = this.scale.at(degree+4);


        let notes = [root, third, fifth];

        // double root
        if (this.doubleRoot) {
            notes.push(root.octave(-1));
        }

        // apply transposition
        notes = notes.map(n => n.up(this.transposition));

        this.playNotes(notes);
        return notes;
    }

    // modifiers

    transpose(n: number): number {
        this.transposition += n;
        return this.transposition;
    }

    setDoubleRoot(b: boolean): boolean {
        this.doubleRoot = b;
        return this.doubleRoot;
    }

    stop(): void {
        this.synth.triggerRelease(this.notesPlaying.map(n => n.noteString()), Tone.now());
        this.notesPlaying = [];
    }
}
