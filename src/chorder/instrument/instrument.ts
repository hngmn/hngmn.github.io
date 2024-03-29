'use strict';

import { debounce } from 'lodash';
import * as Tone from 'tone';

import { Note, Scale } from './music';
import { Switch, MultiSwitch } from './Switches';

export default class Instrument {
    static DEBOUNCE_MS = 60;

    synth: Tone.PolySynth;
    scale: Scale;
    transposition: number;
    degree: number;

    augdim: Switch;
    sus: MultiSwitch;

    voicings: {
        root: [Switch, Switch, Switch],
        mid: [Switch, Switch, Switch],
        high: [Switch, Switch, Switch],
    };

    notesPlaying: Array<Note>;

    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sine' }}).toDestination();
	this.notesPlaying = [];
        this.scale = Scale.CMAJOR;
        this.transposition = 0;

        this.degree = 1;
        this.voicings = {
            root: [new Switch(), new Switch(), new Switch()],
            mid: [new Switch(), new Switch(), new Switch()],
            high: [new Switch(), new Switch(), new Switch()],
        };

        this.augdim = new Switch();
        this.sus = new MultiSwitch(3);

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

    /**
     * Instrument state logic
     */
    update(): Array<Note> {
        // init chord (triad)
        const chord: Chord = {
            root: this.scale.at(this.degree),
            mid: this.scale.at(this.degree+2),
            high: this.scale.at(this.degree+4),
            toPlay: [] as Array<Note>,
        }

        // sus
        if (this.sus.value === 1) { // sus2
            chord.mid = this.scale.at(this.degree+1);
        } else if (this.sus.value === 2) { // sus4
            chord.mid = this.scale.at(this.degree+3);
        }

        // augdim
        if (this.augdim.on) {
            if (Note.diff(chord.root, chord.mid) === 4) { // major; augment
                chord.high = chord.high.up(1);
            } else { // minor; diminish
                chord.high = chord.high.step(-1);
            }
        }

        // voicings
        for (let i = 0; i < 3; i++) {
            if (this.voicings.root[i].on) {
                chord.toPlay.push(chord.root.octave(i-1));
            }
            if (this.voicings.mid[i].on) {
                chord.toPlay.push(chord.mid.octave(i-1));
            }
            if (this.voicings.high[i].on) {
                chord.toPlay.push(chord.high.octave(i-1));
            }
        }

        // apply transposition
        chord.toPlay = chord.toPlay.map(n => n.up(this.transposition));

        this.playNotes(chord);
        return chord.toPlay;
    }

    // modifiers

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

