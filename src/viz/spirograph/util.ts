/**
 * Spirograph helpers
 */

import p5 from 'p5';


// Parametric Function types/helpers
export type ParametricFunction = (t: number) => [number, number];

// just add two pfns
export function pfnAdd(f1: ParametricFunction, f2: ParametricFunction): ParametricFunction {
    return (t: number) => {
        const [x1, y1] = f1(t);
        const [x2, y2] = f2(t);
        return [x1+x2, y1+y2];
    }
}

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

// given parametric function, return closure that draws it at t, translated to location specified by tx, ty, and R (radius)
// notes on translation:
// tx, ty specifies upper-left corner of the square that will enclose the drawing with radius R (side length 2R)
// so the (x, y) returned by pfn will be centered at the point (tx+R, ty+R)
interface DrawOptions {
    R: number;
    tx: number;
    ty: number;
    frameRateMult: number; // # of times to draw per draw call
    label?: string;
    stroke?: (t: number, prev: [number, number], current: [number, number]) => void;
}
const DEFAULT_DRAW_OPTIONS = {
    R: 100,
    tx: 0,
    ty: 0,
    frameRateMult: 1,
};

export function getPfnDrawFn(p: p5, pfn: ParametricFunction, tStep = 0.1, options: Partial<DrawOptions>) {
    // constants
    const TEXT_LABEL_MARGIN = 10;

    const drawOptions: DrawOptions = { ...DEFAULT_DRAW_OPTIONS, ...options };
    const { tx, ty, R, label, frameRateMult } = drawOptions;

    // iteration variables
    let stop = false;
    let t = tStep;
    const [ix, iy] = pfn(0); // store initial value for stopping loop
    let [px, py] = [ix, iy];

    return {
        draw: () => {
            if (stop) {
                return;
            }

            p.push();
            if (label) {
                p.text(label, tx, ty + TEXT_LABEL_MARGIN);
            }
            p.translate(tx+R, ty+R+TEXT_LABEL_MARGIN);

            // draw
            for (let i = 0; i < frameRateMult; i++) {
                const [x, y] = pfn(t);
                if (drawOptions.stroke) {
                    drawOptions.stroke(t, [px, py], [x, y]);
                }
                p.line(px, py, x, y);

                [px, py] = [x, y];
                t += tStep;
            }

            p.pop();
        },
        stop: () => {
            stop = false;
        },
        start: () => {
            stop = true;
        },
        toggle: () => {
            stop = !stop;
        },
    };
}

// p5 utils
// todo: split out
export interface SliderArgs {
    x: number;
    y: number;
    min: number;
    max: number;
    initialValue?: number;
    step?: number;
    size?: number;
    onClick: (newVal: number) => void;
}

export function labeledSlider(p: p5, sliderArgs: SliderArgs, labelFn?: (val: number) => string): p5.Element {
    const {
        x, y,
        min, max, initialValue, step,
        size,
        onClick,
    } = sliderArgs;

    // slider
    const slider = p.createSlider(min, max, initialValue, step);
    if (size) {
        slider.size(size);
    }

    // label
    const labelString = labelFn ? labelFn(slider.value() as number) : slider.value() as string;
    const label = p.createP(labelString);
    slider.mouseClicked(() => {
        const labelString = labelFn ? labelFn(slider.value() as number) : slider.value() as string;
        label.html(labelString);
        onClick(slider.value() as number);
    })

    label.position(x, y, 'fixed');
    slider.position(x+label.size().width!, y, 'fixed');

    return slider;
}