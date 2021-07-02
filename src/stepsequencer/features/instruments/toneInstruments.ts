'use strict';

import type {
    Unit,
} from 'tone';

import instrumentPlayer from './instrumentPlayer';
import { IInstrument } from './types';
import { BaseInstrument } from './Instrument';

export class FirstToneInstrument extends BaseInstrument {
    synth: any;

    constructor() {
        super([]);

        const tone = instrumentPlayer.getTone();
        this.synth = new tone.Synth().toDestination();
    }

    schedule(time: Unit.Time) {
        this.synth.triggerAttackRelease('C2', '4n', time);
    }
}

export class ToneSampler extends BaseInstrument {
    player: any;

    constructor(sampleFilepath: string) {
        super([]);

        const tone = instrumentPlayer.getTone();
        this.player = new tone.Player(sampleFilepath).toDestination();
    }

    schedule(time: Unit.Time) {
        this.player.start(time);
    }
}
