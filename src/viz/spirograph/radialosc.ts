/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { circle, pfnAdd, radialOsc, rotate, rotatePTfn, scaleT } from "../pfn";
import _ from "lodash";
import { PfnDrawControl, getPfnDrawFn } from "../pfn/draw";
import { oscColor } from "../p5util";
import { getSpirographFnByRatio } from "./util";


export function radialOscSpiro(p: p5) {
    let dc: PfnDrawControl;
    const initialColor = [206, 112, 112] as const;
    const endColor = [156, 20, 215] as const;
    const stroke = oscColor(initialColor, endColor, 0.01);

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(249); // clear the screen
        p.frameRate(30);

        const R = p.height/2; // screen radius
        const outerR = R*0.75;
        const rotatedSpiro = rotatePTfn(0.002)(rotate(Math.PI)(getSpirographFnByRatio(0.3, 1/3, R/4)));
        const c = pfnAdd(
            radialOsc(outerR*0.12, 8)(scaleT(0.002)(circle(outerR))),
            scaleT(1)(rotatedSpiro),
        );
        dc = getPfnDrawFn(p, c, {
            tStep: 0.005,
            frameRateMult: 128,
            stroke,
        });
    };

    p.draw = () => {
        dc.draw();
    };
}