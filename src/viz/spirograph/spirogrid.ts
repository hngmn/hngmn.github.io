import p5 from 'p5';
import { getPfnDrawFn, getSpirographFnByRatio } from './util';
import _ from 'lodash';

export function spirogrid(p: p5) {
    const drawPfnArray: Array<() => void> = [];

    p.setup = () => {
        const CANVAS_WIDTH = 2400;
        const CANVAS_HEIGHT = 1800;
        const MARGIN = 16;
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(204); // clear the screen

        const ls = _.range(0.1022, 1, 0.0717);
        const ks = _.range(0.1137, 1, 0.0929);

        // radius of single spiro (fraction of canvas size)
        // Width = #spiros * (2R + margin)
        const R = p.min(
            ((CANVAS_WIDTH / ls.length) - MARGIN) / 2,
            ((CANVAS_HEIGHT / ks.length) - MARGIN) / 2);

        // initialize drawFn for each spirograph
        ls.forEach((l, li) => {
            const spiroX = li * ((2 * R) + MARGIN)
            ks.forEach((k, ki) => {
                const spiroY = ki * ((2*R) + MARGIN)
                const spiroFn = getSpirographFnByRatio(l, k, R);
                const { draw } = getPfnDrawFn(p, spiroFn, 0.005, { tx: spiroX, ty: spiroY, R, label: `l=${l.toFixed(4)}, k=${k.toFixed(4)}`, frameRateMult: 8 });
                drawPfnArray.push(draw);
            });
        });
    }

    p.draw = () => {
        for (let drawSpiro of drawPfnArray) {
            drawSpiro();
        }
    }
}