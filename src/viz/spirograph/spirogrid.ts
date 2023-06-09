import p5 from 'p5';
import { getPfnDrawFn, getSpirographFnByRatio } from './util';
import _ from 'lodash';

export function spirogrid(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;
    const CONTROLS_HEIGHT = 220;
    const MARGIN = 16;

    const drawPfnArray: Array<() => void> = [];
    const toggles: Array<() => void> = [];

    /**
     * (l, k) exploration. Looking into ratios.
     * Customizable numerator, denominator for either l,k, and the other must be fixed to one settable value
     * plus maybe a fudge factor for interesting phase shifting (?)
     * note: numerator bounds denominator
     */
    const rdmin = 2;
    const rdmax = 8;
    const rnmin = 1;
    const rnmax = 7;
    let rdminSelector: p5.Element;
    let rdmaxSelector: p5.Element;
    let rnminSelector: p5.Element;
    let rnmaxSelector: p5.Element;

    const fd = 2;
    const fn = 1;
    let fdSelector: p5.Element;
    let fnSelector: p5.Element;

    // given above parameters, initialize array of spirograph draw functions
    function initSpirogrid() {
        const rds = _.range(rdmin, rdmax+1, 1);

        // radius of single spiro (fraction of canvas size)
        // Width = #spiros * (2R + margin)
        const R = p.min(
            ((CANVAS_WIDTH / rds.length) - MARGIN) / 2,
            (((CANVAS_HEIGHT-CONTROLS_HEIGHT) / (rnmax - rnmin)) - MARGIN) / 2);

        // initialize drawFn for each spirograph
        rds.forEach((rd, rdi) => {
            const spiroX = rdi * ((2 * R) + MARGIN)
            const rns = _.range(rnmin, Math.min(rnmax, rd), 1);

            rns.forEach((rn, rni) => {
                const spiroY = rni * ((2*R) + MARGIN)
                const spiroFn = getSpirographFnByRatio(fn/fd, rn/rd, R);
                const label = `l=${fn}/${fd}=${(fn/fd).toFixed(3)}, k=${rn}/${rd}=${(rn/rd).toFixed(3)}`;
                const { draw, toggle } = getPfnDrawFn(p, spiroFn, 0.005, { tx: spiroX, ty: spiroY, R, label, frameRateMult: 8 });
                drawPfnArray.push(draw);
                toggles.push(toggle);
            });
        });
    }

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(204); // clear the screen

        initSpirogrid();
    }

    p.draw = () => {
        p.translate(0, CONTROLS_HEIGHT);

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