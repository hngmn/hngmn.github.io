'use strict';

import { debounce } from 'lodash';
import * as Tone from 'tone';

import Note from './Note';
import Scale from './Scale';

export default class Instrument {
    static DEBOUNCE_MS = 60;

    synth: Tone.PolySynth
    scale: Scale;
    transposition: number;
    degree: number;

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

        this.degree = 1;
        this.voicings = {
            root: [false, false, false],
            mid: [false, false, false],
            high: [false, false, false],
        };

        this.playNotes = debounce(this.playNotes, Instrument.DEBOUNCE_MS);
    }

    getRoot(): Note {
        return this.scale.at(this.degree).up(this.transposition);
    }

    playNote(note: Note): void {
        if (this.notesPlaying.map(n => n.noteString()).includes(note.noteString())) {
            return;
        }

        this.synth.triggerAttack(note.noteString(), Tone.now())
        this.notesPlaying.push(note);
    }

    playNotes(chord: Chord): void {
        const notesToPlay = chord.toPlay.map(n => n.noteString()); // strings for comparison
        const notesToStop = [];
        for (const np of this.notesPlaying) {
            if (!notesToPlay.includes(np.noteString())) {
                notesToStop.push(np.noteString());
            }
        }
        this.synth.triggerRelease(notesToStop, Tone.now());

        chord.toPlay.forEach(note => {
            this.playNote(note)
        });

        this.notesPlaying = chord.toPlay;
    }

    update(): Array<Note> {
        const chord: Chord = {
            root: this.scale.at(this.degree),
            mid: this.scale.at(this.degree+2),
            high: this.scale.at(this.degree+4),
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

        this.playNotes(chord);
        return chord.toPlay;
    }

    // modifiers

    flagSettersForKeyPresses(setFlag: (ins: Instrument, val: boolean) => void, updateNotesCallback: (notes: Array<Note>) => void) {
        return {
            down: () => {
                setFlag(this, true);
                updateNotesCallback(this.update());
            },
            up: () => {
                setFlag(this, false);
                updateNotesCallback(this.update());
            },
        };
    }

    setDegree(degree: number): number {
        this.degree = degree;
        return this.degree;
    }

    transpose(n: number): number {
        this.transposition += n;
        return this.transposition;
    }
}

interface Chord {
    root: Note
    mid: Note
    high: Note
    toPlay: Array<Note>
}
