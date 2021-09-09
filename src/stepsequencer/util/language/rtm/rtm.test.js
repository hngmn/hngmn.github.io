'use strict';

import * as rtm from './rtm';

const testCases = [
    // literals
    ['x...', [true, false, false, false]],

    // definitions
    ['down = x...\ndown', [true, false, false, false]],
    ['down = x...\nup=..x.\n up', [false, false, true, false]],

    // functions
    ['cat\n  x.\nx.', [true, false, true, false]],
    ['all4', [true, true, true, true]],
    ['all4s', [true, true, true, true]],
    ['empty4', [false, false, false, false]],
    ['empty2e', [false, false, false, false]],
    ['fl8 x..', [true, false, false, false, false, false, false, false]],
    ['fl4 x...x...', [true, false, false, false]],
    ['invert x.x.', [false, true, false, true]],
    ['rpt4 x.', [true, false, true, false, true, false, true, false]],
    ['rs1 x..', [false, true, false]],
    ['rs2 x..', [false, false, true]],
    ['ls2 x..', [false, true, false]],
    ['and x. .x', [false, false]],
    ['and xx .x', [false, true]],
    ['and x.x. ..', [false, false, true, false]],
    ['and .. x.x.', [false, false, true, false]],
    ['or x. .x', [true, true]],
    ['or xx .x', [true, true]],
    ['or x. ..x.', [true, false, true, false]],
    ['exor x. .x', [true, true]],
    ['exor xx .x', [true, false]],
    ['exor x. ..x.', [true, false, true, false]],
];

describe('rtm', () => {
    test.each(testCases)(
        '.parse("%s")',
        (input, expected) => {
            expect(rtm.parse(input)).toStrictEqual(expected);
        }
    );
});
