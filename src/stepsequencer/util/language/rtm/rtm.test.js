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
    ['all 4', [true, true, true, true]],
    ['all 4s', [true, true, true, true]],
    ['empty 4', [false, false, false, false]],
    ['empty 2e', [false, false, false, false]],
    ['fixedlength 8 -..', [true, false, false, false, false, false, false, false]],
    ['fixedlength 4 -...-...', [true, false, false, false]],
    ['invert -.-.', [false, true, false, true]],
    ['reverse -..-.', [false, true, false, false, true]],
    ['repeat 4 -.', [true, false, true, false, true, false, true, false]],
    ['rightshift 1 -..', [false, true, false]],
    ['rightshift 2 -..', [false, false, true]],
    ['leftshift 2 -..', [false, true, false]],
    ['bwand -. .-', [false, false]],
    ['bwand -- .-', [false, true]],
    ['bwand -.-. ..', [false, false, true, false]],
    ['bwand .. -.-.', [false, false, true, false]],
    ['bwor -. .-', [true, true]],
    ['bwor -- .-', [true, true]],
    ['bwor -. ..-.', [true, false, true, false]],
    ['bwxor -. .-', [true, true]],
    ['bwxor -- .-', [true, false]],
    ['bwxor -. ..-.', [true, false, true, false]],

    // variable ref in function call
    ['b = .-\nrepeat 2 b', [false, true, false, true]],

    // nesting
    ['repeat 3 reverse -..', [false, false, true, false, false, true, false, false, true]],
    ['bwor -... repeat 2 .-', [true, true, false, true]],
    ['bwor (repeat 2 .-) -...', [true, true, false, true]],
    [
        'cat -...\n\trepeat 2 -.',
        [true, false, false, false, true, false, true, false]],

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
