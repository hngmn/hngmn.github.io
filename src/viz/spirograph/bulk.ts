/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { getSpiroDrawFnFromSpec, parseSpiroSpec } from "./util";
import { PfnDrawControl } from "../pfn";

const EXAMPLE = '0.625,0.333333,900,100\n0.625,0.335,900,100';

export function bulk(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;
    let spiros: PfnDrawControl[];

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(249); // clear the screen

        spiros = EXAMPLE.split('\n').map(parseSpiroSpec).map(spec => getSpiroDrawFnFromSpec(p, spec));
        console.log(`parsed ${spiros.length} spiro specs`);
    };

    p.draw = () => {
        spiros.forEach(spiro => spiro.draw());
    };
}