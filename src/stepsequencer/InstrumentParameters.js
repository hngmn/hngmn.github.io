'use strict';

import React from 'react';

import Slider from './Slider';

export default class InstrumentParameters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        props.instrument.params.forEach((param) => {
            this.state[param.name] = param.initialValue;
        });
    }

    render() {
        return (
            <div>
                {this.sliders()}
            </div>
        )
    }

    // Return a Slider component for each instrument parameter
    sliders() {
        return this.props.instrument.params.map((param) => (
            <Slider key={param.name} name={param.name} min={param.min} max={param.max} value={this.state[param.name]} step={param.step} onInput={this.onInput(param.name)}/>
        ))
    }

    onInput(name) {
        // This is the onInput callback to connect to the Input element
        const callback = (event) => {
            this.updateParameter(name, event.target.value);
        };

        callback.bind(this);

        return callback;
    }

    // Update this component's state and the corresponding parameter on the actual instrument object
    updateParameter(name, value) {
        const {
            instrument
        } = this.props;

        this.setState({...this.state, [name]: value});

        // update the corresponding parameter on the actual instrument
        instrument[name] = event.target.value;
    }
}
