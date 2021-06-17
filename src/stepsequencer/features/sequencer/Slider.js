'use strict';

import React from 'react';

/**
 * Slider component
 */
export default function Slider(props) {
    console.log(props.param);
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
            <input name={name} id={name} type="range" min={min} max={max} value={value} step={step} onInput={() => {}}/>
        </div>
    );
}
