import p5 from "p5";

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

// given parametric function, return closure that draws it at t, translated to location specified by tx, ty, and R (radius)
// notes on translation:
// tx, ty specifies upper-left corner of the square that will enclose the drawing with radius R (side length 2R)
// so the (x, y) returned by pfn will be centered at the point (tx+R, ty+R)
interface DrawOptions {
    translate?: {
        tx: number;
        ty: number;
        R: number; // new coordinates will be centered at square of radius R (side 2R) at (tx, ty)
    }
    tStep: number;
    frameRateMult: number; // # of times to draw per draw call
    label?: string;
    nFrames?: number;
    stroke?: (t: number, prev: [number, number], current: [number, number]) => void;
}
const DEFAULT_DRAW_OPTIONS = {
    tStep: 0.005,
    frameRateMult: 1,
};

export type PfnDrawControl = ReturnType<typeof getPfnDrawFn>;
export function getPfnDrawFn(p: p5, pfn: ParametricFunction, options: Partial<DrawOptions>) {
    // constants
    const TEXT_LABEL_MARGIN = 10;

    const drawOptions: DrawOptions = { ...DEFAULT_DRAW_OPTIONS, ...options };
    const { translate, label, tStep, frameRateMult, nFrames } = drawOptions;
    let frameCount = nFrames;

    // iteration variables
    let stop = false;
    let t = tStep;
    const [ix, iy] = pfn(0); // store initial value for stopping loop
    let [px, py] = [ix, iy];

    // single draw step
    const stepFrame = (n?: number) => {
        if (frameCount === 0)
            return;

        p.push();

        // center coordinate system for 'radial' pfn drawing
        let upperLeft: [number, number], R: number;
        if (translate) {
            upperLeft = [translate.tx, translate.ty];
            R = translate.R;
        } else {
            upperLeft = [0, 0];
            R = Math.min(p.width / 2, p.height / 2);
        }
        if (label) {
            // convenient to label at upperLeft here, just before translation
            p.text(label, upperLeft[0], upperLeft[1] + TEXT_LABEL_MARGIN);
        }
        p.translate(upperLeft[0] + R, upperLeft[1] + TEXT_LABEL_MARGIN + R);

        // draw
        const nframes = n !== undefined ? n : frameRateMult;
        for (let i = 0; i < nframes; i++) {
            const [x, y] = pfn(t);
            if (drawOptions.stroke) {
                drawOptions.stroke(t, [px, py], [x, y]);
            }
            p.line(px, py, x, y);

            [px, py] = [x, y];
            t += tStep;
        }

        p.pop();
        if (frameCount) {
            frameCount--;
        }
    }

    return {
        draw: () => {
            if (stop) {
                return;
            }
            stepFrame();
        },
        stepFrame,
        stop: () => {
            stop = true;
        },
        start: () => {
            stop = false;
        },
        toggle: () => {
            stop = !stop;
        },
        isStopped: () => stop,
    };
}
