/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { getSpirographFnByRatio } from "./util";
import { range } from "../pfn";
import { rotate } from "../pfn/lib";
import _ from "lodash";
import { PfnDrawControl, getPfnDrawFn } from "../pfn/draw";
import { gradient, oscColor, oscTwoColors, singleColor } from "../p5util";


export function rotateShrink(p: p5) {
    let spiros: PfnDrawControl[];
    let si = 0;
    const initialColor = [206, 112, 112] as const;
    const endColor = [156, 20, 215] as const;
    const stroke = oscColor(initialColor, endColor, 0.1);

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(249); // clear the screen
        p.frameRate(30);

        const ls = range(0.2, 0.8, 0.0046);
        const iR = p.height/2;
        spiros = ls
            .map(([l, _, lp]) => getSpirographFnByRatio(l, 0.33333, iR - (iR*0.4)*lp))
            .map((spiro, i) => rotate(i * 0.04)(spiro))
            .map((pfn) => getPfnDrawFn(p, pfn, {
                tStep: 0.005,
                frameRateMult: 32,
                nSteps: 1300,
                stroke: singleColor(stroke.next().value!),
            }));
        console.log(`drawing ${spiros.length} spiros`)
    };

    p.draw = () => {
        // done
        if (si === spiros.length) {
            return;
        }

        const sfn = spiros[si];

        if (sfn.isStopped()) {
            si++;
        }

        sfn.draw();
    };
}