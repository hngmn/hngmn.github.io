import p5 from "p5";
import { ParametricFunction, getPfnDrawFn, getSpirographFnByRatio, pfnAdd, labeledSlider } from "./util";

// easier, exploratory/interactive spiro sketching
// maybe also color?
export function sketching(p: p5) {
    const CANVAS_WIDTH = 2400;
    const CANVAS_HEIGHT = 1800;

    // mutable spiro parameters
    let l = 0.731;
    let k = 0.601;
    let R = CANVAS_HEIGHT / 2;
    let spiro: ParametricFunction;
    let pfnDrawControl: ReturnType<typeof getPfnDrawFn>;
    let sliderL: p5.Element;
    let sliderK: p5.Element;
    let colorPicker: p5.Element;
    const initialColor = [206, 112, 112] as const;
    const oscColor = [156, 20, 215] as const;

    function initSpiro() {
        function toHex(color: readonly [number, number, number]): string {
            function convert(rgb: number): string {
                const s = Math.floor(rgb).toString(16);
                return s.length === 2 ? s : '0'+s;
            }
            return `#${convert(color[0])}${convert(color[1])}${convert(color[2])}`;
        }
        // color
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

        spiro = getSpirographFnByRatio(sliderL.value() as number, sliderK.value() as number, R);
        const osc: ParametricFunction = (t: number) => {
            const r = 0.1 * R;
            return [r * p.cos(t), r * p.sin(t)];
        }
        (pfnDrawControl = getPfnDrawFn(p, pfnAdd(spiro, osc), 0.005, { R, frameRateMult: 24, stroke }));
    }

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(249); // clear the screen
        p.textAlign(p.CENTER);
        p.textSize(20);
        const helpString = 'Spirograph explorer. <Space> to pause/resume, <c> to clear, <s> to step frame-by-frame';
        p.text(helpString, p.width / 2, 20);

        // l, k sliders
        sliderL = labeledSlider(p, {
            x: 10, y: 100,
            min: 0.001,
            max: 0.999,
            initialValue: l,
            step: 0.001,
            size: 600,
            onClick: initSpiro,
        }, (value: number) => `l=${value.toFixed(3)}`);

        sliderK = labeledSlider(p, {
            x: 10, y: 140,
            min: 0.001,
            max: 0.999,
            initialValue: k,
            step: 0.001,
            size: 600,
            onClick: initSpiro,
        }, (value: number) => `k=${value.toFixed(3)}`);
        colorPicker = p.createColorPicker(p.color(...initialColor));
        colorPicker.position(10, 180);

        // init spiro
        initSpiro();
    };

    p.draw = () => {
        pfnDrawControl.draw();
    };

    p.keyTyped = () => {
        if (p.key === ' ') {
            pfnDrawControl.toggle();
        }
        if (p.key === 'c') {
            p.background(249);
        }
        if (p.key === 's') {
            const STEP_NFRAMES = 8;
            pfnDrawControl.stop(); // in case it's already running
            pfnDrawControl.stepFrame(STEP_NFRAMES);
        }
        return false;
    }
}