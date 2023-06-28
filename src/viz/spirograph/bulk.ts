/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { getSpirographFnByRatio } from "./util";
import { range } from "../pfn";
import { rotate } from "../pfn/lib";
import _ from "lodash";
import { PfnDrawControl, getPfnDrawFn } from "../pfn/draw";
import { oscColor } from "../p5util";


export function bulk(p: p5) {
    let spiros: PfnDrawControl[];
    let si = 0;
    const initialColor = [206, 112, 112] as const;
    const endColor = [156, 20, 215] as const;
    const stroke = oscColor(initialColor, endColor);

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(249); // clear the screen
        p.frameRate(30);

        const ls = range(0.2, 0.9, 0.0046);
        spiros = ls
            .map(([l, _, lp]) => getSpirographFnByRatio(l, 0.33333, (p.height/2) - (p.height*0.2)*lp))
            .map((spiro, i) => rotate(i * 0.01)(spiro))
            .map((pfn, i) => getPfnDrawFn(p, pfn, {
                tStep: 0.005,
                frameRateMult: 32,
                nSteps: 1300,
                stroke: () => stroke(i*0.4),
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