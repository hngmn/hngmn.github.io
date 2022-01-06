'use strict';

import Note from './Note';

describe('Note', () => {

    test('Low note C-2', () => {
        const lowNote = Note.from('C-2');
        expect(lowNote.getValue()).toEqual(0);
    });

    test('High note G8', () => {
        const highNote = Note.from('G8');
        expect(highNote.getValue()).toEqual(127);
    })

    describe('.from()', () => {
        test('("C4")', () => {
            const c4 = Note.from('C4');
            expect(c4.noteString()).toEqual('C4');
            expect(c4.getValue()).toEqual(72);
        });
    });

    const C4 = Note.from('C4');

    describe('.step', () => {
        test('(2)', () => {
            expect(C4.step(2).noteString()).toEqual('D4');
        });

        test('(-2)', () => {
            expect(C4.step(-2).noteString()).toEqual('A#3');
        });
    });

    describe('.octave', () => {
        test('(1)', () => {
            expect(C4.octave(1).noteString()).toEqual('C5');
        });

        test('(0)', () => {
            expect(C4.octave(0).noteString()).toEqual('C4');
        })

        test('(-1)', () => {
            expect(C4.octave(-1).noteString()).toEqual('C3');
        });
    })

    describe('.diff', () => {
        test('D4, C4', () => {
            const D4 = Note.from('D4');
            expect(Note.diff(D4, C4)).toEqual(2);
            expect(Note.diff(C4, D4)).toEqual(2);
        })
    })
});
