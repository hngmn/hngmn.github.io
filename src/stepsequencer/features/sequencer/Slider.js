'use strict';

import React from 'react';

/**
 * Slider component
 */
class Slider extends React.Component {

    static defaultProps = {
        min: 0,
        max: 1,
        value: 0.5,
        step: 0.1,
    };

    constructor(props) {
        super(props);
    }

    render(props) {
        const {
            name,
            min,
            max,
            value,
            step,
            onInput,
        } = this.props;

        return (
            <div>
                <label for="attack">{name} ({value})</label>
                <input name={name} id={name} type="range" min={min} max={max} value={value} step={step} onInput={onInput}/>
            </div>
        )
    }
}

export default Slider;
