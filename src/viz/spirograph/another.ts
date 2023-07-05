/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { circle, pfnAdd, rotate, rotatePTfn, scaleT } from "../pfn";
import _ from "lodash";
import { PfnDrawControl, getPfnDrawFn } from "../pfn/draw";
import { oscColor } from "../p5util";
import { getSpirographFnByRatio } from "./util";


export function another(p: p5) {
    let dc: PfnDrawControl;
    const initialColor = [206, 112, 112] as const;
    const endColor = [156, 20, 215] as const;
    const stroke = oscColor(initialColor, endColor, 0.01);

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(249); // clear the screen
        p.frameRate(30);

        const R = p.height/2; // screen radius
        const rotatedSpiro = rotatePTfn(0.002)(rotate(Math.PI)(getSpirographFnByRatio(0.3, 1/3, R/4)));
        const c = pfnAdd(
            scaleT(0.002)(circle(R*0.75)),
            scaleT(1)(rotatedSpiro),
        );
        dc = getPfnDrawFn(p, c, {
            tStep: 0.005,
            frameRateMult: 32,
            stroke,
        });
    };

    p.draw = () => {
        dc.draw();
    };
}