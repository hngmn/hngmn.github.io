import p5 from 'p5';
import { Pfn } from './pfn';

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


/**
 *
 * @returns A closure which oscillates color between left and right color.
 */
export function oscColor(leftColor: Color, rightColor: Color, oscSpeed = 1): (t: number) => Color {
    // vector math. oscillate color on a straight 'vector' between left and right color
    const lv = new p5.Vector(...leftColor);
    const rv = new p5.Vector(...rightColor);
    const towards = rv.copy().sub(lv);
    const oscFactor = (t: number) => (0.5 - 0.5 * Math.cos(t / oscSpeed)); // scalar on towards, to oscillate between 0 and 1

    return (t: number) => {
        const oc = lv.copy().add(towards.copy().mult(oscFactor(t))).array();
        if (oc.length !== 3) {
            throw new Error('color.length !== 3');
        }

        return oc as unknown as Color;
    };
};

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