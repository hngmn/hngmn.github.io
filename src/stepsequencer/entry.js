'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import wavetable from './wavetable';

class Slider extends React.Component {
    constructor(props) {
        super(props);
    }

    render(props) {
        const {
            name,
            value,
            onInput,
        } = this.props;

        return (
            <div>
                <label for="attack">{name}</label>
                <input name={name} id={name} type="range" min="0" max="1" value={value} step="0.1" onInput={onInput}/>
            </div>
        )
    }

    onInput(event) {
        this.setState({...this.state, value: event.target.value });
    }
}

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

const domContainer = document.querySelector('#stepsequencer_container');
ReactDOM.render(<StepSequencer/>, domContainer);
