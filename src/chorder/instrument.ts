'use strict';

import * as Tone from 'tone';

import Note from './Note';
import Scale from './Scale';

export default class Instrument {
    synth: Tone.PolySynth
    scale: Scale;

    notesPlaying: Array<Note>;

    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
	this.notesPlaying = [];
        this.scale = Scale.CMAJOR;
    }

    play(): void {
        this.playChord(1);
    }

    playNote(note: Note): void {
        const now = Tone.now();
        this.synth.triggerAttack(note.noteString(), now)
        this.notesPlaying.push(note);
    }

    playChord(degree: number): Array<Note> {
        console.log(`chord: ${degree}`);
        const root = this.scale.at(degree);
        const third = this.scale.at(degree+2);
        const fifth = this.scale.at(degree+4);
        this.playNote(root);
        this.playNote(third);
        this.playNote(fifth);

        return [root, third, fifth];
    }

    stop(): void {
        this.synth.triggerRelease(this.notesPlaying.map(n => n.noteString()), Tone.now());
        this.notesPlaying = [];
    }
}
