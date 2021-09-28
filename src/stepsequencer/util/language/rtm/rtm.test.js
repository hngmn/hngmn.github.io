'use strict';

import * as rtm from './rtm';

const testCases = [
    // literals
    ['-...', [true, false, false, false]],
    ['(-.-.)', [true, false, true, false]],

    // definitions
    ['downb = -...\ndownb', [true, false, false, false]],
    ['downb = -...\nupb=..-.\n upb', [false, false, true, false]],

    // functions
    ['cat\n  -.\n-.', [true, false, true, false]],
    ['cat\n  -.\n-. ..', [true, false, true, false, false, false]],
    ['all 4', [true, true, true, true]],
    ['all 4s', [true, true, true, true]],
    ['empty 4', [false, false, false, false]],
    ['empty 2e', [false, false, false, false]],
    ['down 1e', [true, false]],
    ['down 1q', [true, false, false, false]],
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

    // function aliases
    ['rs 1 -..', [false, true, false]],
    ['rs 2 -..', [false, false, true]],
    ['ls 2 -..', [false, true, false]],
    ['rv -..-.', [false, true, false, false, true]],

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
