'use strict';

import React from 'react';

import wavetable from './wavetable';
import PlayButton from './PlayButton';
import {Sweep, Pulse, Noise, Sample} from './instruments';
import Slider from './Slider';
import InstrumentParameters from './InstrumentParameters';

class StepSequencer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false,
            tempo: 60,
            currentNote: 0,

            pads: [
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, true, false, false],
            ],
        };

        this.instruments = {
            sweep: new Sweep(props.audioCtx),
            pulse: new Pulse(props.audioCtx),
            noise: new Noise(props.audioCtx),
            sample: new Sample(props.audioCtx),
        };
    }

    render(props) {
        const {
            // state
            isPlaying,
            tempo,

            // callbacks
            playpause,
        } = this.state;

        return (
            <div>
                <span>
                    <Slider name="bpm" min={10} max={200} value={tempo} step={1} onInput={this.onInput('tempo')}/>

                    <PlayButton
                        isPlaying={isPlaying}
                        onInput={(event) => {
                            this.setState({...this.state, isPlaying: !isPlaying}); // toggle isPlaying

                            // call scheduler.playpause callback
                            playpause();
                        }}
                    />
                </span>

                <span>
                    <InstrumentParameters instrument={this.instruments.sweep}/>
                </span>

                <span>
                    <InstrumentParameters instrument={this.instruments.pulse}/>
                </span>

                <span>
                    <InstrumentParameters instrument={this.instruments.noise}/>
                </span>

                <span>
                    <InstrumentParameters instrument={this.instruments.sample}/>
                </span>
            </div>
        );
    }

    playi(i, time) {
        if (i === 0) {
            playSweep(time);
        } else if (i === 1) {
            playPulse(time);
        } else if (i === 2) {
            playNoise(time);
        } else if (i === 3) {
            playSample(time);
        }
    }

    scheduleNote(beatNumber, time) {
        for (let i = 0; i < 4; i++) {
            if (pads[i][beatNumber]) {
                playi(i, time);
            }
        }
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
