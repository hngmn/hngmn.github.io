import p5 from "p5";
import { ParametricFunction, getPfnDrawFn, getSpirographFnByRatio } from "./util";

// easier, exploratory/interactive spiro sketching
// maybe also color?
export function sketching(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;

    // mutable spiro parameters
    let l = 0.3371;
    let k = 0.203;
    let R = CANVAS_HEIGHT / 2;
    let spiro: ParametricFunction;
    let draw: () => void;

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(249); // clear the screen

        // stroke customize
        p.strokeWeight(2);
        const strokeClosure = (leftColor: [number, number, number], rightColor: [number, number, number]) => {
            const v = new p5.Vector(...leftColor);
            let targetColor = new p5.Vector(...rightColor);
            const towards = targetColor.copy().sub(v).normalize().div(50);
            let i = 0;

            return (t: number, prev: [number, number], current: [number, number]) => {
                p.stroke(v.array());
                if (i++ > 4) {
                    i = 0;
                    v.add(towards);
                }
            };
        };
        const stroke = strokeClosure([206, 112, 112], [156, 20, 215]);

        // init spiro
        spiro = getSpirographFnByRatio(l, k, R);
        ({ draw } = getPfnDrawFn(p, spiro, 0.005, { R, frameRateMult: 24, stroke }));
    };

    p.draw = () => {
        draw();
    };
}