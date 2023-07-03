import p5 from "p5";
import { Coord, ParametricFunction, Tfn, parameterizedPfnTfn } from "../pfn";

interface RotateOptions {
    thetaFn?: (t: number) => number;
}
const defaultRotateOptions = {
    thetaFn: (t: number) => t,
};

function rotateTfn(theta: number): Tfn {
    return (c: Coord) => {
        return new p5.Vector(...c).rotate(theta).array() as Coord;
    }
}

export const rotate = parameterizedPfnTfn(rotateTfn);

// dep
export function getRotatePfn(f: ParametricFunction, options?: RotateOptions): ParametricFunction {
    const { thetaFn } = { ...defaultRotateOptions, ...options};

    return (t: number) => {
        const c = f(t);
        const v = new p5.Vector(...c);
        return v.rotate(thetaFn(t)).array() as Coord;
    };
}

const rotatePPfn = (theta: number) => {

}