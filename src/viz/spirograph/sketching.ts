import p5 from "p5";
import { ParametricFunction, getPfnDrawFn, getSpirographFnByRatio, pfnAdd, labeledSlider } from "./util";

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
    let toggle: () => void;
    let sliderL: p5.Element;
    let sliderK: p5.Element;
    let colorPicker: p5.Element;

    function initSpiro() {
        // color
        p.strokeWeight(1);
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

        spiro = getSpirographFnByRatio(sliderL.value() as number, sliderK.value() as number, R);
        const osc: ParametricFunction = (t: number) => {
            const r = 0.1 * R;
            return [r * p.cos(t), r * p.sin(t)];
        }
        ({ draw, toggle } = getPfnDrawFn(p, pfnAdd(spiro, osc), 0.005, { R, frameRateMult: 24, stroke }));
    }

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(249); // clear the screen

        // l, k sliders
        sliderL = labeledSlider(p, {
            x: 10, y: 100,
            min: 0.001,
            max: 0.999,
            initialValue: l,
            step: 0.001,
            size: 600,
            onClick: initSpiro,
        }, (value: number) => `l=${value.toFixed(3)}`);

        sliderK = labeledSlider(p, {
            x: 10, y: 140,
            min: 0.001,
            max: 0.999,
            initialValue: k,
            step: 0.001,
            size: 600,
            onClick: initSpiro,
        }, (value: number) => `k=${value.toFixed(3)}`);

        // init spiro
        initSpiro();
    };

    p.draw = () => {
        draw();
    };

    p.keyTyped = () => {
        if (p.key === ' ') {
            toggle();
        }
        if (p.key === 'c') {
            p.background(249);
        }
        return false;
    }
}