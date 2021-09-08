'use strict';

import * as rtm from './rtm';

const testCases = [
    ['x...', [true, false, false, false]],
    ['x ...', [true, false, false, false]],
    ['x... x...', [true, false, false, false, true, false, false, false]],
    ['down = x...\ndown', [true, false, false, false]],
    ['down = x...\nup=..x.\n up', [false, false, true, false]],
    ['cat\n  x.\nx.', [true, false, true, false]],
    ['all4', [true, true, true, true]],
    ['empty4', [false, false, false, false]],
];

describe('rtm', () => {
    test.each(testCases)(
        '.parse("%s")',
        (input, expected) => {
            expect(rtm.parse(input)).toStrictEqual(expected);
        }
    );
});
