/**
 * Spirograph helpers
 */

import p5 from 'p5';

import { ParametricFunction } from '../pfn';
import { getPfnDrawFn } from '../pfn/draw';


// Spirograph-specific utils

// given R, r, and rho, return the parametric function f(t) for the spirograph
export function getSpirographFn(R: number, r: number, rho: number): ParametricFunction {
    return (t: number) => {
        const tp = 0 - (((R - r) / r) * t);
        return [
            (R - r) * Math.cos(t) + rho * Math.cos(tp),
            (R - r) * Math.sin(t) + rho * Math.sin(tp),
        ];
    };
}

// 0 <= l, k <= 1. R is optional bounding radius, ie the radius of the larger circle
export function getSpirographFnByRatio(l: number, k: number, R = 100): ParametricFunction {
    return (t: number) => {
        return [
            R * ((1-k) * Math.cos(t) + l * k * Math.cos((1-k)/k * t)),
            R * ((1-k) * Math.sin(t) - l * k * Math.sin((1-k)/k * t)),
        ];
    };
}

// spiro bulk utils

// (l, k, R, nFrames[, ...color vector])
export type SpirographSpec = [number, number, number, number] | [number, number, number, number, number, number, number]
export function getSpiroDrawFnFromSpec(p: p5, spec: SpirographSpec) {
    const [l, k, R, nFrames] = spec;

    const spiroFn = getSpirographFnByRatio(l, k, R);
    return getPfnDrawFn(p, spiroFn, { nFrames, frameRateMult: 24 });
}

export function parseSpiroSpec(specString: string): SpirographSpec {
    const arr = specString.split(',').map(Number);
    if (!(arr.length === 4 || arr.length === 7)) {
        throw new Error(`wrong number of arguments: ${arr}`)
    }
    return arr as SpirographSpec;
}
