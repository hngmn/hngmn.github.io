'use strict';

import * as Tone from 'tone';

import { SliderParameter, SwitchParameter } from './InstrumentParameter';
import {
    BaseInstrument,
    BaseInstrumentOptions,
    IBaseInstrumentDBObject,
} from './BaseInstrument';

export interface IToneSynthDBObject extends IBaseInstrumentDBObject {
    kind: 'ToneSynth';
}

export class ToneSynth extends BaseInstrument {
    kind: 'ToneSynth';
    synth: Tone.Synth;
    distortion: Tone.Distortion;

    constructor(options: BaseInstrumentOptions = {}) {
        super(
            [
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
                )
            ],
            {
                ...options,
                name: options.name ? options.name : 'ToneSynth',
            }
        );
        this.distortion = new Tone.Distortion(0.0).connect(this.channel);
        this.synth = new Tone.Synth().connect(this.distortion);
        this.kind = 'ToneSynth';
    }

    schedule(time: Tone.Unit.Time) {
        this.synth.triggerAttackRelease('C2', '8n', time);
    }

    toDBObject() {
        return {
            kind: this.kind,
            uuid: this.getUuid(),
            name: this.getName(),
            screenName: 'TODO',
            parameters: this.getAllParameterConfigs(),
        };
    }

    static async from(dbo: IToneSynthDBObject) {
        return new ToneSynth({});
    }
}

