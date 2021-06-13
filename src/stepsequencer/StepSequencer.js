'use strict';

import React from 'react';

import Slider from './Slider.js';
import wavetable from './wavetable';

class StepSequencer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            attack: 0.2,
            release: 0.5,
        };

        // for cross browser compatibility
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();

        this.wave = this.audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);
    }

    render(props) {
        const {
            attack,
            release,
        } = this.state;

        return (
            <div>
                <Slider name="attack" value={attack} onInput={this.onInput('attack')}/>

                <Slider name="release" value={release} onInput={this.onInput('release')}/>
            </div>
        );
    }

    playSweep(time) {
        const osc = this.audioCtx.createOscillator();
        osc.setPeriodicWave(this.wave);
        osc.frequency.value = 440;
        osc.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time+1);
    }

    onInput(name) {
        const callback = (event) => {
            this.updateState(name, event.target.value);
        };

        callback.bind(this);

        return callback;
    }

    updateState(name, value) {
        this.setState({...this.state, [name]: value});
    }
}

export default StepSequencer;
