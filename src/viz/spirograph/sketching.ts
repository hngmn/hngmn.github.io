import p5 from "p5";
import { ParametricFunction, getPfnDrawFn, getSpirographFnByRatio } from "./util";

// easier, exploratory/interactive spiro sketching
// maybe also color?
export function sketching(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;

    // mutable spiro parameters
    let l = 0.466;
    let k = 0.713;
    let R = CANVAS_HEIGHT / 2;
    let spiro: ParametricFunction;
    let draw: () => void;

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(204); // clear the screen
        const stroke = (t: number, prev: [number, number], current: [number, number]) => {
            p.stroke('red');
        }

        // init spiro
        spiro = getSpirographFnByRatio(l, k, R);
        ({ draw } = getPfnDrawFn(p, spiro, 0.005, { R, frameRateMult: 36, stroke }));
    };

    p.draw = () => {
        draw();
    };
}