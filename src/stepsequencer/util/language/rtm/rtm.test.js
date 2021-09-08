'use strict';

import * as rtm from './rtm';

const testCases = [
    ['x...', [true, false, false, false]],
    ['x ...', [true, false, false, false]],
    ['x... x...', [true, false, false, false, true, false, false, false]],
    ['down = x...\ndown', [true, false, false, false]],
    ['down = x...\nup=..x.\n up', [false, false, true, false]]
];

describe('rtm', () => {
    test.each(testCases)(
        '.parse("%s")',
        (input, expected) => {
            expect(rtm.parse(input)).toStrictEqual(expected);
        }
    );
});
