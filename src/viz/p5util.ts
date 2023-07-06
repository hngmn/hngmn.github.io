import p5 from 'p5';
import { Pfn, oscillator, range } from './pfn';

// p5 utils

// drawing
export type Color = readonly [number, number, number];

export function toHex(color: Color): string {
    function convert(rgb: number): string {
        const s = Math.floor(rgb).toString(16);
        return s.length === 2 ? s : '0'+s;
    }
    return `#${convert(color[0])}${convert(color[1])}${convert(color[2])}`;
}


export type StrokeColorGenerator = ReturnType<typeof singleColor>;
export function *singleColor(c: Color) {
    while (true) {
        yield c;
    }
}

export function *gradient(c1: Color, c2: Color, speedMultiplier = 1) {
    const nSteps = 100 / speedMultiplier;
    const v1 = new p5.Vector(...c1);
    const v2 = new p5.Vector(...c2);
    const towards = v2.copy().sub(v1);
    towards.setMag(towards.mag() / nSteps)
    for (let i = 0; i < nSteps; i++) {
        yield vToColor(v1);
        v1.add(towards);
    }
}

/**
 *
 * @returns A closure which oscillates color between left and right color.
 */
export const oscColor = (leftColor: Color, rightColor: Color, oscSpeed = 1) => cycleColors(oscSpeed, leftColor, rightColor);
export const oscThreeColors = (c1: Color, c2: Color, c3: Color, scaleT = 1) => cycleColors(scaleT, c1, c2, c3);

// pairwise cycle
export function *cycleColors(scaleT: number, ...colors: Color[]) {
    // rolling window index into colors
    let i=0, j=1;
    let gr = gradient(colors[i], colors[j], scaleT);
    const inc = () => {
        i = (i+1) % colors.length;
        j = (j+1) % colors.length;
        gr = gradient(colors[i], colors[j], scaleT);
    }

    while (true) {
        for (const c of gr) {
            yield c;
        }
        inc();
    }
}

function vToColor(v: p5.Vector): Color {
    const c = v.array();
    if (c.length !== 3) {
        throw new Error('color.length !== 3');
    }
    return c as unknown as Color;
}

// return a closure that oscillates between two colors


// input wrappers

export interface InputArgs {
    x: number;
    y: number;
    initialValue: number;
    size?: number;
    onInput: (newVal: number) => void;
}
export function labeledInput(p: p5, inputArgs: InputArgs, labelString: string): p5.Element {
    const { x, y, initialValue, size, onInput } = inputArgs;

    // input
    const input = p.createInput(String(initialValue));
    if (size) {
        input.size(size);
    }
    input.input(() => onInput(Number(input.value())));

    // label
    const label = p.createP(labelString);

    label.position(x, y, 'fixed');
    input.position(x+label.size().width!+4, y+12, 'fixed');

    return input;
}

export interface SliderArgs {
    x: number;
    y: number;
    min: number;
    max: number;
    initialValue?: number;
    step?: number;
    size?: number;
    onClick: (newVal: number) => void;
}

export function labeledSlider(p: p5, sliderArgs: SliderArgs, labelFn?: (val: number) => string): p5.Element {
    const {
        x, y,
        min, max, initialValue, step,
        size,
        onClick,
    } = sliderArgs;

    // slider
    const slider = p.createSlider(min, max, initialValue, step);
    if (size) {
        slider.size(size);
    }

    // label
    const labelString = labelFn ? labelFn(slider.value() as number) : slider.value() as string;
    const label = p.createP(labelString);
    slider.mouseClicked(() => {
        const labelString = labelFn ? labelFn(slider.value() as number) : slider.value() as string;
        label.html(labelString);
        onClick(slider.value() as number);
    })

    label.position(x, y, 'fixed');
    slider.position(x+label.size().width!, y, 'fixed');

    return slider;
}

export interface RangeSelectorArgs {
    x: number;
    y: number;
    min: number;
    max: number;
    initialValue?: number;
    onChange: (newVal: number) => void;
}
export function labeledRangeSelector(p: p5, selectorArgs: RangeSelectorArgs, labelString?: string): { label: p5.Element, selector: p5.Element } {
    const {
        x, y,
        min, max, initialValue = min,
        onChange,
    } = selectorArgs;

    const selector = p.createSelect();
    _.range(min, max, 1).forEach(n => selector.option(n));
    selector.selected(initialValue);
    selector.changed(onChange);

    const label = p.createP(labelString);
    label.position(x, y, 'fixed');
    selector.position(x+label.size().width, y, 'fixed');

    return {
        label,
        selector,
    };
}