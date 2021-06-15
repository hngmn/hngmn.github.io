'use strict';

import React from 'react';

import InstrumentControl from './InstrumentControl';
import PlayButton from './PlayButton';
import Scheduler from './Scheduler';
import Slider from './Slider';

import {Sweep, Pulse, Noise, Sample} from './instruments';

class StepSequencer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false,
            tempo: 60,
            currentNote: 0,

            pads: [
                [false, true, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
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
                <span>{`beat ${currentNote}`}</span>
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

                <InstrumentControl name={'sweep'} instrument={this.instruments.sweep} pads={pads[0]}/>

                <InstrumentControl name={'pulse'} instrument={this.instruments.pulse} pads={pads[1]}/>

                <InstrumentControl name={'noise'} instrument={this.instruments.noise} pads={pads[2]}/>

                <InstrumentControl name={'sample'} instrument={this.instruments.sample} pads={pads[3]}/>
            </div>
        );
    }

    schedulei(i, time) {
        const {
            sweep,
            pulse,
            noise,
            sample,
        } = this.instruments;

        if (i === 0) {
            console.log(`scheduling sweep at time=${time}, current time is ${this.audioCtx.currentTime}`);
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
        const {
            pads,
        } = this.state;

        for (let i = 0; i < 4; i++) {
            if (pads[i][beatNumber]) {
                this.schedulei(i, time);
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
