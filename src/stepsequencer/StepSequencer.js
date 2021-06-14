'use strict';

import React from 'react';

import Slider from './Slider';
import {getSampleFromFile} from './getSampleFromFile';
import wavetable from './wavetable';
import PlayButton from './PlayButton';

class StepSequencer extends React.Component {
    constructor(props) {
        super(props);

        // Constants
        this.LOOKAHEAD = 25.0; // How frequently to call scheduling function (in milliseconds)
        this.SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)
        this.MAXNOTES = 4; // number of notes in sequencer

        this.state = {
            isPlaying: false,
            tempo: 60,
            currentNote: 0,
            nextNoteTime: 0.0,

            pads: [
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, true, false, false],
            ],

            attack: 0.2,
            release: 0.5,

            lfoHz: 30,
            pulseHz: 880,

            noiseDuration: 1,
            bandHz: 1000,

            playbackRate: 1,
        };

        // for cross browser compatibility
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();

        this.wave = this.audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);
    }

    render(props) {
        const {
            isPlaying,
            tempo,

            attack,
            release,

            lfoHz,
            pulseHz,

            noiseDuration,
            bandHz,

            playbackRate,
        } = this.state;

        return (
            <div>
                <span>
                    <Slider name="bpm" min={10} max={200} value={tempo} step={1} onInput={this.onInput('tempo')}/>

                    <PlayButton
                        isPlaying={isPlaying}
                        onInput={(event) => {
                            console.log(`isPlaying=${this.state.isPlaying}`)
                            this.setState({...this.state, isPlaying: !isPlaying });
                            console.log(`isPlaying=${this.state.isPlaying}`)

                            if (this.state.isPlaying) {

                                // check if context is in suspended state (autoplay policy)
                                if (this.audioCtx.state === 'suspended') {
                                    this.audioCtx.resume();
                                }

                                const currentTime = this.audioCtx.currentTime;
                                console.log(`currentTime=${currentTime}`);
                                this.setState({...this.state, currentNote: 0, nextNoteTime: currentTime});
                                console.log(`nextNoteTime after setState call: ${this.state.nextNoteTime}`);
                                this.scheduler();
                            } else {
                                window.clearTimeout(this.timerId);
                            }

                        }}
                    />

                </span>

                <Slider name="attack" value={attack} onInput={this.onInput('attack')}/>

                <Slider name="release" value={release} onInput={this.onInput('release')}/>

                <Slider name="lfo" min={20} max={40} value={lfoHz} step={1} onInput={this.onInput('lfoHz')}/>

                <Slider name="hz" min={660} max={1320} value={pulseHz} step={1} onInput={this.onInput('pulseHz')}/>

                <Slider name="duration" min={0} max={2} value={noiseDuration} step={0.1} onInput={this.onInput('noiseDuration')}/>

                <Slider name="band" min={400} max={1200} value={bandHz} step={5} onInput={this.onInput('bandHz')}/>

                <Slider name="playbackRate" min={0.1} max={2} value={playbackRate} step={0.1} onInput={this.onInput('playbackRate')}/>
            </div>
        );
    }

    playSweep(time) {
        const {
            attack,
            release
        } = this.state;

        const osc = this.audioCtx.createOscillator();
        osc.setPeriodicWave(this.wave);
        osc.frequency.value = 440;

        const sweepLength = 2;
        let sweepEnv = this.audioCtx.createGain();
        sweepEnv.gain.cancelScheduledValues(time);
        sweepEnv.gain.setValueAtTime(0, time);
        // set our attack
        sweepEnv.gain.linearRampToValueAtTime(1, time + attack);
        // set our release
        sweepEnv.gain.linearRampToValueAtTime(0, time + sweepLength - release);

        osc.connect(sweepEnv).connect(this.audioCtx.destination);
        osc.start(time);
        osc.stop(time+1);
    }

    playPulse(time) {
        const {
            lfoHz,
            pulseHz,
        } = this.state;
        const pulseTime = 1;

        let osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = pulseHz;

        let amp = this.audioCtx.createGain();
        amp.gain.value = 1;

        let lfo = this.audioCtx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = lfoHz;

        lfo.connect(amp.gain);
        osc.connect(amp).connect(this.audioCtx.destination);
        lfo.start();
        osc.start(time);
        osc.stop(time + pulseTime);
    }

    playNoise(time) {
        const {
            noiseDuration,
            bandHz,
        } = this.state;
        const bufferSize = this.audioCtx.sampleRate * noiseDuration;
        const buffer = audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);

        let data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        let noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        let bandpass = this.audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = bandHz;

        noise.connect(bandpass).connect(this.audioCtx.destination);
        noise.start();
    }

    playSample(time) {
        const {
            playbackRate,
        } = this.state;

        const filePath = '/assets/audio/dtmf.mp3';
        getSampleFromFile(this.audioCtx, filePath)
            .then((sample) => {
                this.playSample(sample);
            });

        const sampleSource = this.audioCtx.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.playbackRate.value = playbackRate;
        sampleSource.connect(this.audioCtx.destination)
        sampleSource.start(time);
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

    nextNote() {
        const {
            tempo,
            currentNote,
            nextNoteTime,
        } = this.state;

        console.log(`nextNote called. currentNote=${currentNote}, nextNoteTime=${nextNoteTime}`);

        // advance the step, wrapping around MAXNOTES
        let nextNote = (currentNote + 1) % this.MAXNOTES;

        // update nextNoteTime
        const secondsPerBeat = 60.0 / tempo;
        const nextNextNoteTime = nextNoteTime + secondsPerBeat;
        console.log(`nextnextNoteTime=${nextNextNoteTime}`);

        this.setState({...this.state, currentNote: nextNote, nextNoteTime: nextNextNoteTime})
    }

    scheduleNote(beatNumber, time) {
        const {
            pads,
        } = this.state;

        for (let i = 0; i < 4; i++) {
            if (pads[i][beatNumber]) {
                playi(i, time);
            }
        }
    }

    scheduler() {
        const {
            currentNote,
            nextNoteTime,
        } = this.state;

        let n = 0;
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (n < 10 && nextNoteTime < this.audioCtx.currentTime + this.SCHEDULEAHEADTIME) {
            n++;
            this.scheduleNote(currentNote, nextNoteTime);
            this.nextNote();
        }

        this.timerId = window.setTimeout(this.scheduler.bind(this), this.LOOKAHEAD);
    }
}

export default StepSequencer;
