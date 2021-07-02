'use strict';

import * as Tone from 'tone';

import instrumentPlayer from './instrumentPlayer';
import { IInstrument } from './types';
import { BaseInstrument } from './Instrument';

export class FirstToneInstrument extends BaseInstrument {
    synth: Tone.Synth;

    constructor() {
        super([]);

        this.synth = new Tone.Synth().toDestination();
    }

    schedule(time: Tone.Unit.Time) {
        this.synth.triggerAttackRelease('C2', '4n', time);
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
