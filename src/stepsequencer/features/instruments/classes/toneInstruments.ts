'use strict';

import * as Tone from 'tone';

import instrumentPlayer from '../instrumentPlayer';
import { IInstrument } from '../types';
import { SliderParameter, SwitchParameter } from './InstrumentParameter';
import ToneInstrument from './ToneInstrument';
import BaseInstrument from './BaseInstrument';

export class FirstToneInstrument extends ToneInstrument {
    synth: Tone.Synth;
    distortion: Tone.Distortion;

    constructor(name?: string) {
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
        ], name);
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

    constructor(sampleFilepath: string | Tone.ToneAudioBuffer, name?: string) {
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
            ),
            new SwitchParameter(
                {
                    kind: 'switch',
                    name: 'reverse',
                    value: false,
                },
                (v: boolean) => { this.player.reverse = v },
            )
        ], name);

        this.distortion = new Tone.Distortion(0.0).toDestination();
        this.player = new Tone.Player(sampleFilepath).connect(this.distortion);
    }

    schedule(time: Tone.Unit.Time) {
        this.player.start(time);
    }
}

export class Conjunction extends BaseInstrument {
    instrument1: IInstrument;
    instrument2: IInstrument;
    constructor(instrument1: IInstrument, instrument2: IInstrument) {
        // return list of InstrumentParameters for passing to parent
        function getInstrumentParameters(ins: IInstrument) {
            return ins.getAllParameterNames().map(pname => {
                ins.getParameter(pname).setName(`${ins.getName()}-${pname}`)
                return ins.getParameter(pname)
            });
        }

        super([
            ...getInstrumentParameters(instrument1),
            ...getInstrumentParameters(instrument2),
        ]);

        this.instrument1 = instrument1;
        this.instrument2 = instrument2;
    }

    schedule(time: Tone.Unit.Time) {
        this.instrument1.schedule(time);
        this.instrument2.schedule(time);
    }

    // static helper
}
