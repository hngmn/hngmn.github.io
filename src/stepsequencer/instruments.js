'use strict';

import wavetable from './wavetable';

export class Sweep {
    constructor(audioCtx) {
        this.params = [
            {
                name: 'attack',
                min: 0,
                max: 1,
                initialValue: 0.2,
                step: 0.1,
            },
            {
                name: 'release',
                min: 0,
                max: 1,
                initialValue: 0.5,
                step: 0.1,
            }
        ]

        this.attack = 0.2;
        this.release = 0.5;

        this.audioCtx = audioCtx;
        this.wave = this.audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);
    }

    schedule(time) {
        const osc = this.audioCtx.createOscillator();
        osc.setPeriodicWave(this.wave);
        osc.frequency.value = 440;

        const sweepLength = 2;
        let sweepEnv = this.audioCtx.createGain();
        sweepEnv.gain.cancelScheduledValues(time);
        sweepEnv.gain.setValueAtTime(0, time);
        // set our attack
        sweepEnv.gain.linearRampToValueAtTime(1, time + this.attack);
        // set our release
        sweepEnv.gain.linearRampToValueAtTime(0, time + sweepLength - this.release);

        osc.connect(sweepEnv).connect(this.audioCtx.destination);
        osc.start(time);
        osc.stop(time+1);
    }
}

export class Pulse {
    constructor(audioCtx) {
        this.params = [
            {
                name: 'lfoHz',
                min: 20,
                max: 40,
                initialValue: 30,
                step: 1,
            },
            {
                name: 'pulseHz',
                min: 660,
                max: 1320,
                initialValue: 880,
                step: 1,
            }
        ]

        this.lfoHz = 30;
        this.pulseHz = 880;

        this.audioCtx = audioCtx;
    }

    schedule(time) {
        const pulseTime = 1;

        let osc = this.audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = this.pulseHz;

        let amp = this.audioCtx.createGain();
        amp.gain.value = 1;

        let lfo = this.audioCtx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = this.lfoHz;

        lfo.connect(amp.gain);
        osc.connect(amp).connect(this.audioCtx.destination);
        lfo.start();
        osc.start(time);
        osc.stop(time + pulseTime);
    }
}

export class Noise {
    constructor(audioCtx) {
        this.params = [
            {
                name: 'noiseDuration',
                min: 0,
                max: 2,
                initialValue: 1,
                step: 0.1,
            },
            {
                name: 'bandHz',
                min: 400,
                max: 1200,
                initialValue: 660,
                step: 1,
            }
        ]

        this.bandHz = 1;
        this.noiseDuration = 660;

        this.audioCtx = audioCtx;
    }

    schedule(time) {
        const bufferSize = this.audioCtx.sampleRate * this.noiseDuration;
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);

        let data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        let noise = this.audioCtx.createBufferSource();
        noise.buffer = buffer;

        let bandpass = this.audioCtx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = this.bandHz;

        noise.connect(bandpass).connect(this.audioCtx.destination);
        noise.start(time);
    }
}

export class Sample {
    constructor(audioCtx) {
        this.params = [
            {
                name: 'playbackRate',
                min: 0.1,
                max: 2,
                initialValue: 1,
                step: 0.1,
            }
        ]

        this.filePath = '/assets/audio/dtmf.mp3';
        this.playbackRate = 1;

        this.audioCtx = audioCtx;
    }

    schedule(time) {
        this.audioBuffer = this.getSampleFromFile().then((sampleBuffer) => sampleBuffer);

        const sampleSource = this.audioCtx.createBufferSource();
        sampleSource.buffer = this.audioBuffer;
        sampleSource.playbackRate.value = this.playbackRate;
        sampleSource.connect(this.audioCtx.destination)
        sampleSource.start(time);
    }

    async getSampleFromFile() {
        const response = await fetch(this.filePath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }
}
