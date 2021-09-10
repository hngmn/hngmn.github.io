'use strict';

import * as rtm from './rtm';

const testCases = [
    // literals
    ['-...', [true, false, false, false]],
    ['(-.-.)', [true, false, true, false]],

    // definitions
    ['down = -...\ndown', [true, false, false, false]],
    ['down = -...\nup=..-.\n up', [false, false, true, false]],

    // functions
    ['cat\n  -.\n-.', [true, false, true, false]],
    ['cat\n  -.\n-. ..', [true, false, true, false, false, false]],
    ['all4', [true, true, true, true]],
    ['all4s', [true, true, true, true]],
    ['empty4', [false, false, false, false]],
    ['empty2e', [false, false, false, false]],
    ['fl8 -..', [true, false, false, false, false, false, false, false]],
    ['fl4 -...-...', [true, false, false, false]],
    ['invert -.-.', [false, true, false, true]],
    ['reverse -..-.', [false, true, false, false, true]],
    ['rpt4 -.', [true, false, true, false, true, false, true, false]],
    ['rs1 -..', [false, true, false]],
    ['rs2 -..', [false, false, true]],
    ['ls2 -..', [false, true, false]],
    ['and -. .-', [false, false]],
    ['and -- .-', [false, true]],
    ['and -.-. ..', [false, false, true, false]],
    ['and .. -.-.', [false, false, true, false]],
    ['or -. .-', [true, true]],
    ['or -- .-', [true, true]],
    ['or -. ..-.', [true, false, true, false]],
    ['exor -. .-', [true, true]],
    ['exor -- .-', [true, false]],
    ['exor -. ..-.', [true, false, true, false]],

    // nesting
    ['r3 rv -..', [false, false, true, false, false, true, false, false, true]],
    ['or -... r2 .-', [true, true, false, true]],
    ['or r2 .- -...', [true, true, false, true]],
    [
        'cat -...\n\trpt2 -.\n\t--\n',
        [true, false, false, false, true, false, true, false, true, true]],

    // misc edge cases
    [' -..', [true, false, false]],
    ['-.. ', [true, false, false]],
    [' -.. ', [true, false, false]],
    ['( -.-.)', [true, false, true, false]],
];

describe('rtm', () => {
    test.each(testCases)(
        '.parse("%s")',
        (input, expected) => {
            expect(rtm.parse(input)).toStrictEqual(expected);
        }
    );
});
