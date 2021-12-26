'use strict';

import * as Tone from 'tone';

import Note from './Note';
import Scale from './Scale';

export default class Instrument {
    synth: Tone.PolySynth
    scale: Scale;
    transposition: number;

    doubleRoot: boolean;

    voicings: {
        root: [boolean, boolean, boolean],
        mid: [boolean, boolean, boolean],
        high: [boolean, boolean, boolean],
    };

    notesPlaying: Array<Note>;

    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
	this.notesPlaying = [];
        this.scale = Scale.CMAJOR;
        this.transposition = 0;

        this.doubleRoot = false;
        this.voicings = {
            root: [false, false, false],
            mid: [false, false, false],
            high: [false, false, false],
        };
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

        const chord = {
            root: this.scale.at(degree),
            mid: this.scale.at(degree+2),
            high: this.scale.at(degree+4),
            toPlay: [] as Array<Note>,
        }

        // voicings
        for (let i = 0; i < 3; i++) {
            if (this.voicings.root[i]) {
                chord.toPlay.push(chord.root.octave(i-1));
            }
            if (this.voicings.mid[i]) {
                chord.toPlay.push(chord.mid.octave(i-1));
            }
            if (this.voicings.high[i]) {
                chord.toPlay.push(chord.high.octave(i-1));
            }
        }

        // apply transposition
        chord.toPlay = chord.toPlay.map(n => n.up(this.transposition));

        this.playNotes(chord.toPlay);
        return chord.toPlay;
    }

    // modifiers

    flagSettersForKeyPresses(setFlag: (ins: Instrument, val: boolean) => void) {
        return {
            down: () => setFlag(this, true),
            up: () => setFlag(this, false),
        };
    }

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
