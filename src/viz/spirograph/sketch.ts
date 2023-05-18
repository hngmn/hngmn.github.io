import * as React from 'react';
import p5 from 'p5';
import PlayButton from '../../stepsequencer/features/sequencer/PlayButton';

export default function spirograph(p: p5) {
    let R = 260; // outer circle radius
    let r = 80;  // inner circle radius
    let rho = 17;  // inner circle point radius
    let t = 0;
    let dt = 0.02;
    let pvec = p.createVector(R - r + rho, 0);

    let Rinput: p5.Element, rinput: p5.Element, rhoinput: p5.Element, button;

    let spirofn = (t: number) => {
        const tp = 0 - (((R - r) / r) * t);
        return [
            (R - r) * p.cos(t) + rho * p.cos(tp),
            (R - r) * p.sin(t) + rho * p.sin(tp),
        ];
    }

    p.setup = () => {
        p.createCanvas(1000, 700);
        p.background(204); // clear the screen

        let inputY = 100;
        Rinput = p.createInput(String(R));
        Rinput.position(20, inputY);
        inputY += 30
        rinput = p.createInput(String(r));
        rinput.position(20, inputY);
        rinput.value(r);
        inputY += 30
        rhoinput = p.createInput();
        rhoinput.position(20, inputY);
        rhoinput.value(String(rho));
        inputY += 30
        button = p.createButton('Add');
        button.position(20, inputY);
        button.mousePressed(update);
        inputY += 30;
        let clearbutton = p.createButton('Clear');
        clearbutton.position(20, inputY);
        clearbutton.mousePressed(() => p.background(204));
    }

    function update() {
        R = Number(Rinput.value());
        r = Number(rinput.value());
        rho = Number(rhoinput.value());
        pvec = p.createVector(R - r + rho, 0);
        t = 0;
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