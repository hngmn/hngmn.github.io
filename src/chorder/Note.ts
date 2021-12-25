'use strict';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
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

    constructor(n: number) {
        this.value = n;
    }

    toString(): string {
        return intToNote[this.value];
    }

    static from(note: NoteString): Note {
        return new Note(noteToInt[note]);
    }
}

type NoteLetterr = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
type NoteModifier = '' | 'b' | '#';
type NoteLetter = `${NoteLetterr}${NoteModifier}`;
type Octave = '-2' | '-1' | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
type NoteString = `${NoteLetter}${Octave}`;
