'use strict';

import * as rtm from './rtm';

const testCases = [
    ['3', 3],
    ['x...', [true, false, false, false]],
];

describe('rtm', () => {
    test.each(testCases)(
        '.parse(%s)',
        (input, expected) => {
            expect(rtm.parse(input)).toStrictEqual(expected);
        }
    );
});
