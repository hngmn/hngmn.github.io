import p5 from "p5";
import { Coord, PPfnTfn, Pfn, Tfn, parameterizedPfnTfn, parametricTransformationPolar, pfnPTfn, tfnPolarToCartesian } from "../pfn";

function rotateTfn(theta: number): Tfn {
    return (c: Coord) => {
        return new p5.Vector(...c).rotate(theta).array() as Coord;
    }
}
export const rotate = parameterizedPfnTfn(rotateTfn);

export const rotatePTfn = (scaleT = 1) => pfnPTfn((t: number) => (c: Coord) => {
    return new p5.Vector(...c).rotate(t * scaleT).array() as Coord;
});

function radialOscTfn(R: number, scaleT = 1): Tfn {
    return tfnPolarToCartesian(parametricTransformationPolar({
        rTfn: ([r, theta]) => r + (R * Math.sin(scaleT * theta)),
    }));
}

export const radialOsc = parameterizedPfnTfn(radialOscTfn);


export const scaleT: PPfnTfn<[number]> =
    (factor: number) => (pfn: Pfn) => (t: number) => {
        return pfn(t * factor);
    };