import p5 from 'p5';
import { getPfnDrawFn, getSpirographFnByRatio } from './util';

export default function spirograph(p: p5) {

    const drawPfnArray: Array<(t: number) => void> = [];

    p.setup = () => {
        const CANVAS_WIDTH = 2400;
        const CANVAS_HEIGHT = 1800;
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(204); // clear the screen

        const dr = 0.05;                       // diff ratio per spiro (ie iteration step)
        const nSpiros = (0.9 - 0.1) / dr + 1;  // # spiros per row
        const R = CANVAS_HEIGHT / nSpiros / 2; // radius of single spiro (fraction of canvas size)

        // initialize drawFn for each spirograph
        let li = 0;
        const margin = 20;
        for (let l = 0.1; l <= 0.9 ; l += dr) {
            const spiroX = R + p.width * (l - 0.1) + (li * margin)
            let ki = 0;
            for (let k = 0.1; k <= 0.9; k += dr) {
                const spiroY = R + p.height * (k - 0.1) + (ki * margin)
                const spiroFn = getSpirographFnByRatio(l, k, R);
                const drawFn = getPfnDrawFn(p, spiroFn, spiroX, spiroY, `(${l}, ${k})`);
                drawPfnArray.push(drawFn);
                ki++;
            }
            li++;
        }
    }

    let t = 0;
    let dt = 0.01;
    p.draw = () => {
        for (let drawSpiro of drawPfnArray) {
            drawSpiro(t);
        }
        t += dt;
    }
}