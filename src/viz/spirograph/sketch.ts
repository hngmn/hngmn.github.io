import * as React from 'react';
import p5 from 'p5';

type ParametricFunction = (t: number) => [number, number];

export default function spirograph(p: p5) {

    // given R, r, and rho, return the parametric function f(t) for the spirograph
    const getSpirographFn = (R: number, r: number, rho: number) => (t: number) => {
        const tp = 0 - (((R - r) / r) * t);
        return [
            (R - r) * p.cos(t) + rho * p.cos(tp),
            (R - r) * p.sin(t) + rho * p.sin(tp),
        ];
    }

    // 0 <= l, k <= 1. R is optional bounding radius, ie the radius of the larger circle
    const getSpirographFnByRatio = (l: number, k: number, R = 100): ParametricFunction => (t: number) => {
        return [
            R * ((1-k) * p.cos(t) + l * k * p.cos((1-k)/k * t)),
            R * ((1-k) * p.sin(t) - l * k * p.sin((1-k)/k * t)),
        ];
    };

    // given parametric function, return closure that draws it at t, translated to location x, y
    const getPfnDrawFn = (pfn: ParametricFunction, tx: number, ty: number, label?: string) => {
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

    const drawPfnArray: Array<(t: number) => void> = [];

    p.setup = () => {
        const CANVAS_WIDTH = 2400;
        const CANVAS_HEIGHT = 1800;
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(204); // clear the screen

        const dr = 0.05;                       // diff ratio per spiro (ie iteration step)
        const nSpiros = (0.9 - 0.1) / dr + 1;  // # spiros per row
        const R = CANVAS_HEIGHT / nSpiros / 2; // radius of single spiro (fraction of canvas size)

        // initialize drawFn for each spirograph
        let li = 0;
        const margin = 20;
        for (let l = 0.1; l <= 0.9 ; l += dr) {
            let ki = 0;
            for (let k = 0.1; k <= 0.9; k += dr) {
                const spiroFn = getSpirographFnByRatio(l, k, R);
                const drawFn = getPfnDrawFn(spiroFn, p.width * k + (ki * margin), p.height * l + (li * margin), `(${l}, ${k})`);
                drawPfnArray.push(drawFn);
                ki++;
            }
            li++;
        }
    }

    let t = 0;
    let dt = 0.01;
    p.draw = () => {
        for (let drawSpiro of drawPfnArray) {
            drawSpiro(t);
        }
        t += dt;
    }

    function polarToCartesian(r: number, theta: number): [number, number] {
        return [r * p.cos(theta), r * p.sin(theta)];
    }
}