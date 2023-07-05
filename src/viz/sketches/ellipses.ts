/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { circle, ellipse, oscillator, pfnAdd, radialOsc, rotate, rotatePTfn, scaleT } from "../pfn";
import _ from "lodash";
import { addDrawControl, getPfnDrawFn } from "../pfn/draw";
import { oscColor } from "../p5util";


export function ellipses(p: p5) {
    const dc = addDrawControl(p);
    const initialColor = [206, 112, 112] as const;
    const endColor = [156, 20, 215] as const;
    const stroke = oscColor(initialColor, endColor, 0.003);

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(249); // clear the screen
        p.frameRate(30);

        const R = p.height/2; // screen radius
        const outerR = R*0.75;
        const a = oscillator(R/8 * 0.6, 0.017, R/8);
        const b = oscillator(R/10 * 0.4, 0.0041, R/10);
        const rotatedSpiro = rotatePTfn(0.002)(rotate(Math.PI)(ellipse(a, b)));
        const c = pfnAdd(
            radialOsc(outerR*0.12, 8)(scaleT(0.002)(circle(outerR))),
            scaleT(1)(rotatedSpiro),
        );
        dc(getPfnDrawFn(p, c, {
            tStep: 0.01,
            frameRateMult: 256,
            stroke,
        }));
    };
}