'use strict';

import Scale from './Scale';


function* range(start: number, end: number) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}

describe('Scale', () => {
    describe('CMAJOR', () => {
        test('has 7 notes', () => {
            expect(Scale.CMAJOR.getNotes().length).toEqual(7);
        });

        test('note array is correct', () => {
            expect(Scale.CMAJOR.getNotes().map(note => note.noteString()))
                .toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'B5']);
        });

        test('.at() returns correct notes', () => {
            expect([...range(1,7)].map(n => Scale.CMAJOR.at(n).noteString()))
                .toEqual(['C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'B5']);
        });
    });

    describe('.at()', () => {
        test('degrees above 7', () => {
            expect(Scale.CMAJOR.at(8).noteString()).toEqual('C5');
            expect(Scale.CMAJOR.at(9).noteString()).toEqual('D5');
            expect(Scale.CMAJOR.at(11).noteString()).toEqual('F5');
        })
    });

    describe('.transpose()', () => {
        test('C Major to D Major', () => {
            expect(Scale.CMAJOR.transpose(2).getNotes().map(note => note.noteString()))
                .toEqual(['D4', 'E4', 'F#4', 'G4', 'A5', 'B5', 'C#5']);
        });

        test('C Major up to G Major', () => {
            expect(Scale.CMAJOR.transpose(7).getNotes().map(note => note.noteString()))
                .toEqual(['G4', 'A5', 'B5', 'C5', 'D5', 'E5', 'F#5']);
        });

        test('C Major down to G Major', () => {
            expect(Scale.CMAJOR.transpose(-5).getNotes().map(note => note.noteString()))
                .toEqual(['G3', 'A4', 'B4', 'C4', 'D4', 'E4', 'F#4']);
        });
    });

    describe('.mode()', () => {
        test('Mode of C Major', () => {
            expect(Scale.CMAJOR.mode(6).getNotes().map(note => note.noteString()))
                .toEqual(['A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5']);
        });
    });
});
