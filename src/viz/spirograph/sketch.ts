import * as React from 'react';
import p5 from 'p5';
import { Linter } from 'eslint';

export default function spirograph(p: p5) {
    let NUMSINES = 16; // how many of these things can we do at once?
    let R = 260; // outer circle radius
    let r = 80;  // inner circle radius
    let rho = 17;  // inner circle point radius
    let t = 0;
    let dt = 0.02;

    let spirofn = (t: number) => {
        const tp = 0 - (((R - r) / r) * t);
        return [
            (R - r) * p.cos(t) + rho * p.cos(tp),
            (R - r) * p.sin(t) + rho * p.sin(tp),
        ];
    }

    let pvec = p.createVector(R - r + rho, 0);

    p.setup = () => {
        p.createCanvas(1000, 700);
        p.background(204); // clear the screen
    }

    p.draw = () => {
        // MAIN ACTION
        p.translate(p.width / 2, p.height / 2); // move to middle of screen

        const vec = p.createVector(...spirofn(t));
        p.line(pvec.x, pvec.y, vec.x, vec.y);

        // iterate
        t += dt;
        pvec = vec;
    }

    function polarToCartesian(r: number, theta: number): [number, number] {
        return [r * p.cos(theta), r * p.sin(theta)];
    }
}