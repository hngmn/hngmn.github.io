'use strict';

import Note from './Note';

describe('Note', () => {
    const C4 = Note.from('C4');
    describe('step', () => {
        test('up(2)', () => {
            expect(C4.step(2).noteString()).toEqual('D4');
        });

        test('step(-2)', () => {
            expect(C4.step(-2).noteString()).toEqual('A#4');
        });
    });
});
