/**
 * Spirograph helpers
 */

import p5 from 'p5';


export type ParametricFunction = (t: number) => [number, number];

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

// given parametric function, return closure that draws it at t, translated to location specified by tx, ty, and R (radius)
// notes on translation:
// tx, ty specifies upper-left corner of the square that will enclose the drawing with radius R (side length 2R)
// so the (x, y) returned by pfn will be centered at the point (tx+R, ty+R)
interface DrawOptions {
    tx: number;
    ty: number;
    R: number;
    label?: string;
    frameRateMult?: number; // # of times to draw per draw call
}
export function getPfnDrawFn(p: p5, pfn: ParametricFunction, tStep = 0.1, options: DrawOptions) {
    // constants
    const TEXT_LABEL_MARGIN = 10;

    const { tx, ty, R, label, frameRateMult = 1 } = options;

    // iteration variables
    let t = 0;
    const [ix, iy] = pfn(0); // store initial value for stopping loop
    let [px, py] = [ix, iy];

    return () => {
        p.push();
        if (label) {
            p.text(label, tx, ty + TEXT_LABEL_MARGIN);
        }
        p.translate(tx+R, ty+R+TEXT_LABEL_MARGIN);

        // draw
        for (let i = 0; i < frameRateMult; i++) {
            const [x, y] = pfn(t);
            p.line(px, py, x, y);

            [px, py] = [x, y];
            t += tStep;
        }

        p.pop();
    }
}
