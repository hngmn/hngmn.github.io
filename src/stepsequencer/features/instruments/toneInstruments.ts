'use strict';

import * as Tone from 'tone';

import { IInstrument } from './types';
import { BaseInstrument } from './Instrument';

export class FirstToneInstrument extends BaseInstrument {
    synth: any;

    constructor() {
        super([]);

        this.synth = new Tone.Synth().toDestination();
    }

    schedule(time: number) {
        this.synth.triggerAttackRelease('C2', '4n', time);
    }
}

export class ToneSampler extends BaseInstrument {
    player: any;

    constructor(sampleFilepath: string) {
        super([]);

        this.player = new Tone.Player(sampleFilepath).toDestination();
    }

    schedule(time: number) {
        this.player.start(time);
    }
}
