'use strict';

const NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const OCTAVES = ['-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8'];
const intToNote: Array<string> = OCTAVES.map(
    octave => NOTES.map(
        note => `${note}${octave}`
    )
).flat().slice(0, 128);

const noteToInt: Record<string, number> = {};
for (const [i, note] of intToNote.entries()) {
    noteToInt[note] = i;
}

export default class Note {
    value: number;

    private constructor(n: number) {
        this.value = n;
    }

    noteString(): string {
        return intToNote[this.value];
    }

    up(n = 1): Note {
        return this.step(n);
    }

    step(n = 1): Note {
        return new Note(this.value + n);
    }

    octave(n = 1): Note {
        return new Note(this.value + (n * 12));
    }

    static from(note: NoteString): Note {
        return new Note(noteToInt[note]);
    }

    static diff(n1: Note, n2: Note): number {
        return Math.abs(n2.value - n1.value);
    }
}

type NoteLetterr = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
type NoteModifier = '' | 'b' | '#';
type NoteLetter = `${NoteLetterr}${NoteModifier}`;
type Octave = '-2' | '-1' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type NoteString = `${NoteLetter}${Octave}`;
