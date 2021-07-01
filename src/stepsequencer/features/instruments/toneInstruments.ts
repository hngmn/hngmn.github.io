'use strict';

import { getTone } from './instrumentPlayer';
import { IInstrument } from './types';
import { BaseInstrument } from './Instrument';

export class FirstToneInstrument extends BaseInstrument {
    synth: any;

    constructor() {
        super([]);

        const tone = getTone();
        this.synth = new tone.Synth().toDestination();
    }

    schedule(time: number) {
        this.synth.triggerAttackRelease('C2', '4n', time);
    }
}

export class ToneSampler extends BaseInstrument {
    player: any;

    constructor(sampleFilepath: string) {
        super([]);

        const tone = getTone();
        this.player = new tone.Player(sampleFilepath).toDestination();
    }

    schedule(time: number) {
        this.player.start(time);
    }
}
