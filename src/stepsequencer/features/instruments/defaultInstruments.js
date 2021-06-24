'use strict';

import wavetable from './wavetable';

class Instrument {
    setParameter(parameterName, value) {
        this[parameterName] = value;
    }
}

export class Sweep extends Instrument {
    constructor(audioCtx) {
        super();

        this.params = {
            attack: {
                name: 'attack',
                min: 0,
                max: 1,
                value: 0.2,
                step: 0.1,
            },

            release: {
                name: 'release',
                min: 0,
                max: 1,
                value: 0.5,
                step: 0.1,
            },
        };

        this.attack = this.params.attack.value;
        this.release = this.params.release.value;

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

export class Pulse extends Instrument {
    constructor(audioCtx) {
        super();

        this.params = {
            lfoHz: {
                name: 'lfoHz',
                min: 20,
                max: 40,
                value: 30,
                step: 1,
            },

            pulseHz: {
                name: 'pulseHz',
                min: 660,
                max: 1320,
                value: 880,
                step: 1,
            }
        }

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

export class Noise extends Instrument {
    constructor(audioCtx) {
        super();

        this.params = {
            noiseDuration: {
                name: 'noiseDuration',
                min: 0.1,
                max: 2,
                value: 1,
                step: 0.1,
            },

            bandHz: {
                name: 'bandHz',
                min: 400,
                max: 1200,
                value: 660,
                step: 1,
            }
        };

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

export class Sample extends Instrument {
    constructor(audioCtx) {
        super();

        this.params = {
            playbackRate: {
                name: 'playbackRate',
                min: 0.1,
                max: 2,
                value: 1,
                step: 0.1,
            }
        };

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
