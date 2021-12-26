'use strict';

import Note from './Note';

const Intervals: Record<string, Array<number>>= {
    MAJOR: [2, 2, 1, 2, 2, 2],
    MINOR: [2, 1, 2, 2, 1, 2],
}

export default class Scale {
    notes: Array<Note>
    root: Note

    private constructor(root: Note, intervals: Array<number>) {
        this.root = root;
        this.notes = [root];
        let note = root;
        for (const step of intervals) {
            note = note.up(step);
            this.notes.push(note);
        }
    }

    // initializers

    static major(root: Note): Scale {
        return new Scale(root, Intervals.MAJOR);
    }

    static minor(root: Note): Scale {
        return new Scale(root, Intervals.MINOR);
    }

    static CMAJOR = Scale.major(Note.from('C4'));

    // methods

    /**
     * Return note at nth position in the scale, starting indexing at 1.
     */
    at(n: number): Note {
        const i = n-1;
        return this.notes[i % this.notes.length].octave(Math.floor(i / this.notes.length));
    }
}
