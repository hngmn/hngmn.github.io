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

    let R = 260; // outer circle radius
    let r = 80;  // inner circle radius
    let rho = 17;  // inner circle point radius
    let drawSpiro: (t: number) => void;

    p.setup = () => {
        p.createCanvas(1000, 700);
        p.background(204); // clear the screen
        const spiro = getSpirographFnByRatio(rho / r, r / R, R);
        drawSpiro = getPfnDrawFn(spiro, p.width / 2, p.height / 2, 'main spiro');
    }

    let t = 0;
    let dt = 0.03;
    p.draw = () => {
        drawSpiro(t);
        t += dt;
    }

    function polarToCartesian(r: number, theta: number): [number, number] {
        return [r * p.cos(theta), r * p.sin(theta)];
    }
}