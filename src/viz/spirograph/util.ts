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

// given parametric function, return closure that draws it at t, translated to location x, y
export function getPfnDrawFn(p: p5, pfn: ParametricFunction, tx: number, ty: number, label?: string) {
    const [ix, iy] = pfn(0); // store initial value for stopping loop
    let [px, py] = [ix, iy];

    return (t: number) => {
        p.push();
        p.translate(tx, ty);

        // draw
        const [x, y] = pfn(t);
        p.line(px, py, x, y);

        [px, py] = [x, y];
        p.pop();
    }
}
