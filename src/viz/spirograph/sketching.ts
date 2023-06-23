import p5 from "p5";

import { getSpirographFnByRatio } from "./util";
import { Coord, ParametricFunction, Transformation, parametricTransformationPolar, pfnTfn, tfnPolarToCartesian } from "../pfn";
import { labeledInput } from "../p5util";
import { PfnDrawControl, getPfnDrawFn } from "../pfn/draw";

// easier, exploratory/interactive spiro sketching
// maybe also color?
export function sketching(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;

    // mutable spiro parameters
    let l = 0.625;
    let k = 0.3333;
    let R = CANVAS_HEIGHT / 2;
    let oscRP = 4;
    let oscFreq = 4;
    let spiro: ParametricFunction;
    let pfnDrawControl: PfnDrawControl;
    let inputL: p5.Element;
    let inputK: p5.Element;
    let inputR: p5.Element;
    let colorPicker: p5.Element;
    let inputOscRP: p5.Element;
    let inputOscFreq: p5.Element;
    const initialColor = [206, 112, 112] as const;
    const oscColor = [156, 20, 215] as const;

    function initSpiro() {
        // color
        function toHex(color: readonly [number, number, number]): string {
            function convert(rgb: number): string {
                const s = Math.floor(rgb).toString(16);
                return s.length === 2 ? s : '0'+s;
            }
            return `#${convert(color[0])}${convert(color[1])}${convert(color[2])}`;
        }
        p.strokeWeight(1);
        const strokeClosure = (leftColor: readonly [number, number, number], rightColor: readonly [number, number, number]) => {
            // vector math. oscillate color on a straight 'vector' between left and right color
            const lv = new p5.Vector(...leftColor);
            const rv = new p5.Vector(...rightColor);
            const towards = rv.copy().sub(lv);
            const oscPeriodConstant = 12; // control speed of color oscillation
            const oscFactor = (t: number) => (0.5 - 0.5 * Math.cos(t / oscPeriodConstant)); // scalar on towards, to oscillate between 0 and 1

            return (t: number, prev: [number, number], current: [number, number]) => {
                const oc = lv.copy().add(towards.copy().mult(oscFactor(t))).array();
                p.stroke(oc);
                colorPicker.value(toHex(oc as [number, number, number]));
            };
        };
        const stroke = strokeClosure(initialColor, oscColor);

        const l = Number(inputL.value());
        const k = Number(inputK.value());
        const R = Number(inputR.value());

        const oscRP = Number(inputOscRP.value());
        const oscFreq = Number(inputOscFreq.value());

        spiro = getSpirographFnByRatio(l, k, R);
        const radialOsc: Transformation = tfnPolarToCartesian(parametricTransformationPolar({
            rTfn: ([r, theta]) => r + (oscRP/100 * r) * Math.sin(theta * oscFreq),
        }));
        const oscillatedSpiro = pfnTfn(radialOsc)(spiro);
        const rotate = (c: Coord) => {
            const v = new p5.Vector(...c);
            return v.rotate(2 * Math.PI * (1 + oscRP/100)).array() as Coord;
        }
        const rotatedSpiro = pfnTfn(rotate)(spiro);

        const previousDrawing = pfnDrawControl;

        pfnDrawControl = getPfnDrawFn(p, oscillatedSpiro, { tStep: 0.005, frameRateMult: 8, stroke });

        if (previousDrawing?.isStopped()) {
            console.log('stopping new spiro');
            pfnDrawControl.stop();
        }
    }

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(249); // clear the screen
        p.textAlign(p.CENTER);
        p.textSize(20);
        const helpString = 'Spirograph sketcher. <Space> to pause/resume, <c> to clear, <s> to step frame-by-frame';
        p.text(helpString, p.width / 2, 20);

        // l, k, R inputs
        inputL = labeledInput(p, {
            x: 10, y: 120,
            initialValue: l,
            size: 60,
            onInput: initSpiro,
        }, 'l');

        inputK = labeledInput(p, {
            x: 10, y: 150,
            initialValue: k,
            size: 60,
            onInput: initSpiro,
        }, 'k');

        inputR = labeledInput(p, {
            x: 10, y: 180,
            initialValue: R,
            size: 80,
            onInput: initSpiro,
        }, 'R');

        colorPicker = p.createColorPicker(p.color(...initialColor));
        colorPicker.position(10, 220, 'fixed');

        // oscillator R%, Freq inputs
        inputOscRP = labeledInput(p, {
            x: inputR.position().x + inputR.size().width + 40,
            y: inputL.position().y,
            initialValue: oscRP,
            onInput: initSpiro,
        }, 'oscR (% of R)');

        inputOscFreq = labeledInput(p, {
            x: inputR.position().x + inputR.size().width + 40,
            y: inputOscRP.position().y + 30,
            initialValue: oscFreq,
            onInput: initSpiro,
        }, 'osc frequency');

        // init spiro
        initSpiro();
    };

    p.draw = () => {
        pfnDrawControl.draw();
    };

    p.keyTyped = () => {
        if (p.key === ' ') {
            pfnDrawControl.toggle();
            return false; // disable scroll down on space
        }
        if (p.key === 'c') {
            p.background(249);
        }
        if (p.key === 's') {
            const STEP_NFRAMES = 8;
            pfnDrawControl.stop(); // in case it's already running
            pfnDrawControl.stepFrame(STEP_NFRAMES);
        }
    }
}