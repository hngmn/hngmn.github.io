'use strict';

import {
    Coord,
    cartesianToPolar,
    polarToCartesian,
} from './pfn';

describe('Polar Coordinate Conversion', () => {
    test('hello test', () => {
        expect('hello').toEqual('hello');
    });

    type TestCase = [Coord, Coord];
    describe('polarToCartesian', () => {
        const testCases: TestCase[] = [
            // format:
            // [inputCoord, expectedCoord],
            [[0, 0], [0, 0]],
            [[1, 0], [1, 0]],
            [[1, Math.PI / 2], [0, 1]],
            [[3, Math.PI / 2], [0, 3]],
        ];
        testCases.forEach(([input, expected]) => {
            test(`(${input}) => (${expected})`, () => {
                expect(polarToCartesian(input)).toEqual(expected);
            });
        });
        test('sanity', () => {
            expect(3 * Math.sin(Math.PI / 2)).toEqual(3);
        })
    });

    describe('cartesianToPolar', () => {
        const testCases: TestCase[] = [
            [[1, 0], [1, 0]],
            [[0, 1], [1, Math.PI / 2]],
            [[-1, 0], [1, Math.PI]],
            [[0, -1], [1, 3/2*Math.PI]],
            [[-1, -1], [Math.sqrt(2), 7/8*Math.PI]],
        ];
        testCases.forEach(([input, expected]) => {
            test(`(${input}) => (${expected})`, () => {
                expect(cartesianToPolar(input)).toEqual(expected);
            });
        });
    });
});