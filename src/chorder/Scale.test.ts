'use strict';

import Scale from './Scale';

describe('Scale', () => {
    test('CMAJOR has 7 notes', () => {
        expect(Scale.CMAJOR.notes.length).toEqual(7);
    });
});
