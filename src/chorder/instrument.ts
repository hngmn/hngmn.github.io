'use strict';

import * as Tone from 'tone';

export default class Instrument {
    synth: Tone.PolySynth

    constructor() {
        this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    }

    play(): void {
        const now = Tone.now();
        this.synth.triggerAttack('C4', now)
        this.synth.triggerAttack('E4', now)
        this.synth.triggerAttack('G3', now)
    }

    stop(): void {
        this.synth.triggerRelease(['C4', 'E4', 'G3'], Tone.now());
    }
}
