import p5 from 'p5';
import { getPfnDrawFn, getSpirographFnByRatio, labeledRangeSelector } from './util';
import _ from 'lodash';

export function spirogrid(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;
    const CONTROLS_HEIGHT = 160;
    const MARGIN = 16;

    let drawPfnArray: Array<() => void> = [];
    let toggles: Array<() => void> = [];

    /**
     * (l, k) exploration. Looking into ratios.
     * Customizable numerator, denominator for either l,k, and the other must be fixed to one settable value
     * plus maybe a fudge factor for interesting phase shifting (?)
     * note: numerator bounds denominator
     */

    // exploring l or k
    let lkSelector: p5.Element;

    // ratio numerator, denominator ranges
    let rdminSelector: p5.Element;
    let rdmaxSelector: p5.Element;
    let rnminSelector: p5.Element;
    let rnmaxSelector: p5.Element;

    let fudgeFactorInput: p5.Element;

    // fixed ratio
    let fdSelector: p5.Element;
    let fnSelector: p5.Element;

    // given above parameters, initialize array of spirograph draw functions
    function initSpirogrid() {
        // clear
        p.background(204); // clear the screen
        drawPfnArray = [];
        toggles = [];

        const lk = lkSelector.value();
        console.log(`lk=${lkSelector.value()}`);
        const fn = Number(fnSelector.value());
        console.log(`fn=${fn}`);
        const fd = Number(fdSelector.value());
        console.log(`fd=${fd}`);
        const rdmin = Number(rdminSelector.value());
        console.log(`rdmin=${rdmin}`);
        const rdmax = Number(rdmaxSelector.value());
        console.log(`rdmax=${rdmax}`);
        const rnmin = Number(rnminSelector.value());
        console.log(`rnmin=${rnmin}`);
        const rnmax = Number(rnmaxSelector.value());
        console.log(`rnmax=${rnmax}`);
        const fudgeFactor = 1 + Number(fudgeFactorInput.value())/100;
        console.log(`fudge=${fudgeFactor}`);

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
                let l: number, k: number;
                let label: string;
                if (lk === 'k') {
                    l = fn/fd;
                    k = rn/rd * fudgeFactor;
                    label = `l=${fn}/${fd}=${l.toFixed(3)}, k=${rn}/${rd}=${k.toFixed(3)}`;
                } else {
                    l = rn/rd * fudgeFactor;
                    k = fn/fd;
                    label = `l=${rn}/${rd}=${l.toFixed(3)}, k=${fn}/${fd}=${k.toFixed(3)}`;
                }

                const spiroY = rni * ((2*R) + MARGIN)
                const spiroFn = getSpirographFnByRatio(l, k, R);
                const { draw, toggle } = getPfnDrawFn(p, spiroFn, 0.005, { tx: spiroX, ty: spiroY, R, label, frameRateMult: 8 });
                drawPfnArray.push(draw);
                toggles.push(toggle);
            });
        });
    }

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

        // controls
        const fns = labeledRangeSelector(p, {
            x: 10, y: 120,
            min: 1, max: 16, initialValue: 3,
            onChange: initSpirogrid,
        }, 'fn');
        fnSelector = fns.selector;

        const fds = labeledRangeSelector(p, {
            x: 10, y: 170,
            min: 1, max: 16, initialValue: 5,
            onChange: initSpirogrid,
        }, 'fd');
        fdSelector = fds.selector;

        const rnmins = labeledRangeSelector(p, {
            x: fnSelector.position().x + fnSelector.size().width + 10, y: 120,
            min: 1, max: 16, initialValue: 1,
            onChange: initSpirogrid,
        }, 'rnmin');
        rnminSelector = rnmins.selector;

        const rnmaxs = labeledRangeSelector(p, {
            x: rnminSelector.position().x + rnminSelector.size().width + 10, y: 120,
            min: 2, max: 16, initialValue: 7,
            onChange: initSpirogrid,
        }, 'rnmax');
        rnmaxSelector = rnmaxs.selector;

        const rdmins = labeledRangeSelector(p, {
            x: fdSelector.position().x + fnSelector.size().width + 10, y: 170,
            min: 2, max: 16, initialValue: 2,
            onChange: initSpirogrid,
        }, 'rdmin');
        rdminSelector = rdmins.selector;

        const rdmaxs = labeledRangeSelector(p, {
            x: rdminSelector.position().x + rdminSelector.size().width + 10, y: 170,
            min: 2, max: 16, initialValue: 8,
            onChange: initSpirogrid,
        }, 'rdmax');
        rdmaxSelector = rdmaxs.selector;

        lkSelector = p.createSelect();
        lkSelector.position(rnmaxSelector.position().x + rnmaxSelector.size().width + 10, 120);
        lkSelector.option('l');
        lkSelector.option('k');
        lkSelector.selected('k');
        lkSelector.changed(initSpirogrid);

        const fudgeLabel = p.createP('fudge %: ');
        fudgeLabel.position(lkSelector.position().x + lkSelector.size().width + 10, 120)
        fudgeFactorInput = p.createInput('1');
        fudgeFactorInput.position(fudgeLabel.position().x + fudgeLabel.size().width + 10, 120);
        fudgeFactorInput.size(60);
        fudgeFactorInput.input(initSpirogrid);

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
        // return false;
    }
}