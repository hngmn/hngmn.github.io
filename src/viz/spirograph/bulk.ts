/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { getSpirographFnByRatio } from "./util";
import { PfnDrawControl, getPfnDrawFn, range } from "../pfn";

const EXAMPLE = '0.625,0.333333,900,100\n0.625,0.335,900,100';

export function bulk(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;
    let spiros: PfnDrawControl[];

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(249); // clear the screen
        p.frameRate(30);

        // spiros = EXAMPLE.split('\n').map(parseSpiroSpec).map(spec => getSpiroDrawFnFromSpec(p, spec));
        spiros = range(0.2, 0.9, 0.016)
            .reverse()
            .map(([l, _, lp]) => getSpirographFnByRatio(l, 0.33333, 600 + 300*lp))
            .map(spiro => getPfnDrawFn(p, spiro, {
                tStep: 0.001,
                frameRateMult: 32,
                nFrames: 200,
            }));
        console.log(`parsed ${spiros.length} spiro specs`);
    };

    const nToDraw = 8;
    let spiroi = 0, di=1;
    p.draw = () => {
        p.background(249); // clear the screen
        _.range(spiroi, spiroi+nToDraw, 1).forEach(i => {
            spiros[i].drawAllFrames();
            spiros[i].resetFrames();
        });
        if (spiroi === spiros.length - nToDraw) {
            di = -1;
        } else if (spiroi === 0) {
            di = 1;
        }
        spiroi += di;
    };
}