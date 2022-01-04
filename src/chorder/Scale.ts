'use strict';

import Note from './Note';

const Intervals: Record<string, Array<number>>= {
    MAJOR: [2, 2, 1, 2, 2, 2, 1],
    MINOR: [2, 1, 2, 2, 1, 2, 2],
}

export default class Scale {
    readonly #root: Note
    readonly #intervals: Array<number>
    readonly #notes: Array<Note>

    private constructor(root: Note, intervals: Array<number>) {
        this.#root = root;
        this.#intervals = intervals;

        this.#notes = [root];
        let note = root;
        for (const step of intervals) {
            note = note.up(step);
            this.#notes.push(note);
        }

        this.#notes.pop();
    }

    // initializers

    static major(root: Note): Scale {
        return new Scale(root, Intervals.MAJOR);
    }

    static minor(root: Note): Scale {
        return new Scale(root, Intervals.MINOR);
    }

    static aeolian(root: Note): Scale {
        return new Scale(root, Scale.CMAJOR.mode(6).#intervals);
    }

    static CMAJOR = Scale.major(Note.from('C4'));

    // accessors

    /**
     * Return note at nth position in the scale, starting indexing at 1.
     */
    at(degree: number): Note {
        const i = degree-1;
        return this.#notes[i % this.#notes.length].octave(Math.floor(i / this.#notes.length));
    }

    getRoot(): Note {
        return this.#root;
    }

    getIntervals(): Array<number> {
        return this.#intervals;
    }

    getNotes(): Array<Note> {
        return this.#notes;
    }

    // instance methods to return new scales

    transpose(n: number): Scale {
        return new Scale(this.#root.step(n), this.#intervals);
    }

    // Return the `degree`th mode of the scale. This uses the same notes, but
    // just starts the root at the degree by rotating the intervals left by
    // degree-1. Ex: The 6th mode (aeolian) of C Major contains the same notes,
    // just starting at A (ie the first five notes have been shifted and wrap
    // around)
    mode(degree: number): Scale {
        const rotn = degree - 1;
        return new Scale(this.at(degree), [this.#intervals.slice(rotn), this.#intervals.slice(0, rotn)].flat());
    }
}
