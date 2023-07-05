import _ from "lodash";

// Parametric Function types/helpers
export type Coord = [number, number];
export type ParametricFunction = (t: number) => Coord;
export type Pfn = ParametricFunction;
export type PPfn<Args extends any[]> = (...args: Args) => Pfn;

// Tfns
export type ScalarTfn = (n: number) => number;
export type Transformation = (c: Coord) => Coord;
export type Tfn = Transformation;
export type PTfn = (t: number) => Tfn;

// PfnTfn, ie applied Tfns
export type PfnTfn = (pfn: Pfn) => Pfn;
export type PPfnTfn<Args extends any[]> = (...args: Args) => PfnTfn;

// Tfn applications

/**
 * Given a Transformation, return a PfnTfn that just applies the tfn to the return value
 */
export function pfnTfn(tfn: Transformation): PfnTfn {
    return (pfn: ParametricFunction) => {
        return (t: number) => tfn(pfn(t));
    };
}

/**
 * Given a PTfn, return the PfnTfn
 */
export function pfnPTfn(ptfn: PTfn): PfnTfn {
    return (pfn: Pfn) => {
        return (t: number) => ptfn(t)(pfn(t));
    }
}

export function parameterizedPfnTfn<Args extends any[]>(ptfn: (...args: Args) => Tfn): PPfnTfn<Args> {
    return (...args: Args) => {
        const tfn = ptfn(...args);
        return (pfn: Pfn) => (t: number) => (tfn(pfn(t)));
    }
}

// polar coords

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

// misc

export type ArgProvider = number | ((t: number) => number);

export function getArg(argProvider: ArgProvider, t: number): number {
    if (typeof(argProvider) === 'number') {
        return argProvider;
    } else {
        return argProvider(t);
    }
}

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