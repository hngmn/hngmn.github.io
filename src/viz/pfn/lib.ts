import p5 from "p5";
import { Coord, ParametricFunction, identity } from "./pfn";

interface RotateOptions {
    thetaFn?: (t: number) => number;
}
const defaultRotateOptions = {
    thetaFn: (t: number) => t,
};
export function rotate(f: ParametricFunction, options?: RotateOptions): ParametricFunction {
    const { thetaFn } = { ...defaultRotateOptions, ...options};

    return (t: number) => {
        const c = f(t);
        const v = new p5.Vector(...c);
        return v.rotate(thetaFn(t)).array() as Coord;
    };
}