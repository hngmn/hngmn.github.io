'use strict';

import React from 'react';

import PlayButton from './PlayButton';
import {Sweep, Pulse, Noise, Sample} from './instruments';
import Slider from './Slider';
import InstrumentParameters from './InstrumentParameters';
import Scheduler from './Scheduler';

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

        // for cross browser compatibility
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();

        // instruments in the sequencer
        this.instruments = {
            sweep: new Sweep(this.audioCtx),
            pulse: new Pulse(this.audioCtx),
            noise: new Noise(this.audioCtx),
            sample: new Sample(this.audioCtx),
        };

        // Scheduler for precision scheduling of sounds at each beat/note
        this.scheduler = new Scheduler(
            this.audioCtx,
            this.scheduleNote.bind(this),
            (note) => {
                this.setState({currentNote: note});
            }
        );
    }

    render() {
        const {
            // state
            isPlaying,
            tempo,
            currentNote,
            pads,
        } = this.state;

        return (
            <div>
                <span>{currentNote}</span>
                <span>{isPlaying ? 'playing' : 'paused'}</span>

                <span>
                    <Slider name="bpm" min={10} max={200} value={tempo} step={1} onInput={this.onInput('tempo')}/>

                    <PlayButton
                        isPlaying={isPlaying}
                        onInput={(event) => {
                            this.setState((state, props) => ({isPlaying: !state.isPlaying}));

                            // play/pause the scheduler
                            this.scheduler.playpause();
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
        const {
            sweep,
            pulse,
            noise,
            sample,
        } = this.instruments;

        if (i === 0) {
            sweep.schedule(time);
        } else if (i === 1) {
            pulse.schedule(time);
        } else if (i === 2) {
            noise.schedule(time);
        } else if (i === 3) {
            sample.schedule(time);
        }
    }

    scheduleNote(beatNumber, time) {
        return;
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
        this.setState({[name]: value});
    }
}

export default StepSequencer;
