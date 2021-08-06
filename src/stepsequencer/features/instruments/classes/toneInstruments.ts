'use strict';

import * as Tone from 'tone';

import instrumentPlayer from '../instrumentPlayer';
import { IInstrument } from '../types';
import { SliderParameter } from './InstrumentParameter';
import ToneInstrument from './ToneInstrument';
import BaseInstrument from './BaseInstrument';

export class FirstToneInstrument extends ToneInstrument {
    synth: Tone.Synth;
    distortion: Tone.Distortion;

    constructor() {
        super([
            new SliderParameter(
                {
                    kind: 'slider',
                    name: 'distortion',
                    min: 0.0,
                    max: 1.0,
                    value: 0.0,
                    step: 0.1,
                },
                (v: number) => this.distortion.set({ distortion: v })
            ),
        ]);
        this.distortion = new Tone.Distortion(0.0).toDestination();
        this.synth = new Tone.Synth().connect(this.distortion);
    }

    schedule(time: Tone.Unit.Time) {
        this.synth.triggerAttackRelease('C2', '8n', time);
    }
}

export class TonePlayer extends ToneInstrument {
    player: Tone.Player;
    distortion: Tone.Distortion;

    constructor(sampleFilepath: string | Tone.ToneAudioBuffer) {
        super([
            new SliderParameter(
                {
                    kind: 'slider',
                    name: 'distortion',
                    min: 0.0,
                    max: 1.0,
                    value: 0.0,
                    step: 0.1,
                },
                (v: number) => this.distortion.set({ distortion: v })
            ),
            new SliderParameter(
                {
                    kind: 'slider',
                    name: 'playbackRate',
                    min: 0.1,
                    max: 3.0,
                    value: 1.0,
                    step: 0.1,
                },
                (v: number) => { this.player.playbackRate = v; }
            )
        ]);

        this.distortion = new Tone.Distortion(0.0).toDestination();
        this.player = new Tone.Player(sampleFilepath).connect(this.distortion);
    }

    schedule(time: Tone.Unit.Time) {
        this.player.start(time);
    }

    reverse() {
        this.player.reverse = true;
        return this;
    }
}

export class Conjunction extends BaseInstrument {
    instrument1: BaseInstrument;
    instrument2: BaseInstrument;
    constructor(instrument1: BaseInstrument, instrument2: BaseInstrument) {
        super([]);

        this.instrument1 = instrument1;
        this.instrument2 = instrument2;
    }

    schedule(time: Tone.Unit.Time) {
        this.instrument1.schedule(time);
        this.instrument2.schedule(time);
    }
}
