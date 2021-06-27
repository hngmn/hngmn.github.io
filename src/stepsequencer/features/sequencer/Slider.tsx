'use strict';

import * as React from 'react';

import { InstrumentParameter } from '../instruments/types';

interface Props {
    param: InstrumentParameter,
    onInput: (e: React.FormEvent<HTMLInputElement>) => void,
}

/**
 * Slider component
 */
export default function Slider(props: Props) {
    const {
        name = 'defaultName?',
        min = 0, // defaults
        max = 1,
        value = 0.5,
        step = 0.1,
    } = props.param;

    return (
        <div>
            <label htmlFor={name}>slider for {name} ({value})</label>
            <input name={name} id={name} type="range" min={min} max={max} value={value} step={step} onInput={props.onInput}/>
        </div>
    );
}
