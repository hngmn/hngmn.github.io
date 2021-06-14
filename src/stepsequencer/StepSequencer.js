'use strict';

import React from 'react';

import Slider from './Slider';
import wavetable from './wavetable';
import {getSampleFromFile} from './getSampleFromFile';

class StepSequencer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
                <Slider name="attack" value={attack} onInput={this.onInput('attack')}/>

                <Slider name="release" value={release} onInput={this.onInput('release')}/>

                <Slider name="lfo" min={20} max={40} value={lfoHz} step={1} onInput={this.onInput('lfoHz')}/>

                <Slider name="hz" min={660} max={1320} value={pulseHz} step={1} onInput={this.onInput('pulseHz')}/>

                <Slider name="duration" min={0} max={2} value={noiseDuration} step={0.1} onInput={this.onInput('noiseDuration')}/>

                <Slider name="band" min={400} max={1200} value={bandHz} step={5} onInput={this.onInput('bandHz')}/>

                <Slider name="plabackRate" min={0.1} max={2} value={playbackRate} step={0.1} onInput={this.onInput('playbackRate')}/>
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

        console.log(typeof audioBuffer);
        console.log(audioBuffer);
        const sampleSource = this.audioCtx.createBufferSource();
        sampleSource.buffer = audioBuffer;
        sampleSource.playbackRate.value = playbackRate;
        sampleSource.connect(this.audioCtx.destination)
        sampleSource.start(time);
        return sampleSource;
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
