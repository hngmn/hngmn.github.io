import p5 from 'p5';
import { getPfnDrawFn, getSpirographFnByRatio } from './util';
import _ from 'lodash';

export function spirogrid(p: p5) {
    const drawPfnArray: Array<() => void> = [];
    const toggles: Array<() => void> = [];

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
                const label = `l=${l.toFixed(4)}, k=${k.toFixed(4)}, l-k=${(l-k).toFixed(4)}`;
                const { draw, toggle } = getPfnDrawFn(p, spiroFn, 0.005, { tx: spiroX, ty: spiroY, R, label, frameRateMult: 8 });
                drawPfnArray.push(draw);
                toggles.push(toggle);
            });
        });
    }

    p.draw = () => {
        for (let drawSpiro of drawPfnArray) {
            drawSpiro();
        }
    }

    p.keyTyped = () => {
        if (p.key === ' ') {
            toggles.forEach(toggle => toggle());
        }
        return false;
    }
}