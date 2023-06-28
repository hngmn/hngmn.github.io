
import p5 from "p5";
import { Pfn } from "./pfn";
import { Color } from "../p5util";

// Drawing utils

// given a parametric function, return closure with controls for drawing it on a centered coordinate system
//
// optionally translate to location specified by tx, ty, and R (radius)
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
    nSteps?: number;
    stroke?: (t: number) => Color;
}
const DEFAULT_DRAW_OPTIONS = {
    tStep: 0.005,
    frameRateMult: 1,
};

export type PfnDrawControl = ReturnType<typeof getPfnDrawFn>;
export function getPfnDrawFn(p: p5, pfn: Pfn, options: Partial<DrawOptions>) {
    // constants
    const TEXT_LABEL_MARGIN = 10;

    const drawOptions: DrawOptions = { ...DEFAULT_DRAW_OPTIONS, ...options };
    const { translate, label, tStep, frameRateMult, nFrames, nSteps } = drawOptions;
    let frameCount = nFrames;
    let stepCount = nSteps;

    // iteration variables
    let stop = false;
    let t = tStep;
    const [ix, iy] = pfn(0); // store initial value for stopping loop
    let [px, py] = [ix, iy];

    // draw a single p5 'frame', consisting of the specified number of
    // points/iterations (default <frameRatemult>) of the pfn
    const stepFrame = (nPoints = frameRateMult) => {
        if ((frameCount !== undefined && frameCount <= 0)
            || (stepCount !== undefined && stepCount <= 0)) {
            stop = true;
            return;
        }

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
        p.scale(1, -1); // flip coordinate axis upright

        // draw
        for (let i = 0; i < nPoints; i++) {
            const [x, y] = pfn(t);
            if (drawOptions.stroke) {
                p.stroke(...drawOptions.stroke(t));
            }
            p.line(px, py, x, y);

            [px, py] = [x, y];
            t += tStep;
        }

        p.pop();
        if (frameCount) {
            frameCount--;
        }
        if (stepCount) {
            stepCount -= nPoints;
        }
    }

    return {
        draw: () => {
            if (stop) {
                return;
            }
            stepFrame();
        },
        drawAllFrames: () => {
            while (frameCount !== undefined && frameCount > 0) {
                stepFrame();
            }
        },
        resetFrames: () => {
            frameCount = nFrames;
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
