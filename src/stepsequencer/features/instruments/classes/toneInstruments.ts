'use strict';

import * as Tone from 'tone';

import instrumentPlayer from '../instrumentPlayer';
import { IInstrument } from '../types';
import { BaseInstrument } from './Instrument';

export class FirstToneInstrument extends BaseInstrument {
    synth: Tone.Synth;
    distortion: Tone.Distortion;

    constructor() {
        super([{
            name: 'distortion',
            min: 0.0,
            max: 1.0,
            value: 0.0,
            step: 0.1,
        }]);

        this.distortion = new Tone.Distortion(0.0).toDestination();
        this.synth = new Tone.Synth().connect(this.distortion);
    }

    schedule(time: Tone.Unit.Time) {
        this.synth.triggerAttackRelease('C2', '8n', time);
    }

    setParameterValue(parameterName: string, value: number) {
        this.params.byId[parameterName].value = value;
        this.distortion.set({
            distortion: value,
        });
    }
}

export class ToneSampler extends BaseInstrument {
    player: Tone.Player;

    constructor(sampleFilepath: string) {
        super([]);

        this.player = new Tone.Player(sampleFilepath).toDestination();
    }

    schedule(time: Tone.Unit.Time) {
        this.player.start(time);
    }
}
