import _ from "lodash";
import p5 from "p5";

// Parametric Function types/helpers
export type Coord = [number, number];
export type ParametricFunction = (t: number) => Coord;

export type ScalarTfn = (n: number) => number;
export type Transformation = (c: Coord) => Coord;

// syntactic sugar
export const identity: Transformation = (c: Coord) => c;

/**
 * Given a Transformation and ParametricFunction, apply to get the new Parametric Function
 */
export function tfnApply(tfn: Transformation, pfn: ParametricFunction): ParametricFunction {
    return (t: number) => tfn(pfn(t));
}

/**
 * Given a transformation in parametric terms the new, transformed x' and y' in terms of
 * x and, return the Transformation
 *
 * note on arg names: This applies to both cartesian and polar functions so I'm calling
 * them left and right here rather than (x,y) or (r,theta)
 */
export function parametricTransformationPolar({ rTfn, thetaTfn }: Partial<{ rTfn: (c: Coord) => number, thetaTfn: (c: Coord) => number }>): Transformation {
    return parametricTransformation({ leftTfn: rTfn, rightTfn: thetaTfn });
}
export function parametricTransformationCartesian({ xTfn, yTfn }: Partial<{ xTfn: (c: Coord) => number, yTfn: (c: Coord) => number }>): Transformation {
    return parametricTransformation({ leftTfn: xTfn, rightTfn: yTfn });
}
function parametricTransformation({ leftTfn, rightTfn }: Partial<{ leftTfn: (c: Coord) => number, rightTfn: (c: Coord) => number }>): Transformation {
    return (c: Coord) => [
        leftTfn ? leftTfn(c) : c[0],
        rightTfn ? rightTfn(c) : c[1],
    ];
}

// just add two pfns
export function pfnAdd(f1: ParametricFunction, f2: ParametricFunction): ParametricFunction {
    return (t: number) => {
        const [x1, y1] = f1(t);
        const [x2, y2] = f2(t);
        return [x1+x2, y1+y2];
    }
}

// utils for polar coordinates
export function cartesianToPolar([x, y]: Coord): Coord {
    return [Math.hypot(x, y), Math.atan2(y, x)];
}

export function polarToCartesian([r, theta]: Coord): Coord {
    return [r * Math.cos(theta), r * Math.sin(theta)];
}

// Given a Pfn in polar coordinates (r, theta), return the same Pfn in cartesian
export function pfnPolarToCartesian(polarPfn: ParametricFunction): ParametricFunction {
    return (t: number) => polarToCartesian(polarPfn(t));
}

// Given a Transformation in polar coords, return the same Transformation in Cartesian
// Essentially convert to apply transform, then convert back
// Makes it easier to specify 'radial' transforms
export function tfnPolarToCartesian(polarTfn: Transformation): Transformation {
    return (c: Coord) => polarToCartesian(polarTfn(cartesianToPolar(c)));
}

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

// misc

// [number, index, index as a percent]
type RangeIterationVariables = [number, number, number];
export function range(start: number, end: number, step: number): RangeIterationVariables[] {
    const r: RangeIterationVariables[] = [];
    let i = 0;
    _.range(start, end, step).forEach(n => {
        r.push([n, i++, (n-start)/(end-start)]);
    });
    return r;
}