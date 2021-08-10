'use strict';

import * as Tone from 'tone';

import instrumentPlayer from '../instrumentPlayer';
import {
    IInstrument,
    ITonePlayerDBObject,
} from '../types';
import { SliderParameter, SwitchParameter } from './InstrumentParameter';
import BaseInstrument from './BaseInstrument';
import { BaseInstrumentOptions } from './BaseInstrument';

export class ToneSynth extends BaseInstrument {
    kind: 'ToneSynth';
    synth: Tone.Synth;
    distortion: Tone.Distortion;

    constructor(options: BaseInstrumentOptions) {
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
        this.distortion = new Tone.Distortion(0.0).toDestination();
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
}

export class TonePlayer extends BaseInstrument {
    kind: 'TonePlayer';
    player: Tone.Player;
    distortion: Tone.Distortion;
    lowpass: Tone.Filter;

    constructor(url: string, options: BaseInstrumentOptions = {}) {
        super(
            [
                new SliderParameter(
                    {
                        kind: 'slider',
                        name: 'lowpassHz',
                        min: 40,
                        max: 22000,
                        value: 15000,
                        step: 10,
                    },
                    (v: number) => this.lowpass.set({frequency: v})
                ),
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
            ],
            {
                ...options,
                name: options.name ? options.name : url,
            }
        );

        this.kind = 'TonePlayer';
        this.lowpass = new Tone.Filter(15000, 'lowpass').toDestination();
        this.distortion = new Tone.Distortion(0.0).connect(this.lowpass);
        this.player = new Tone.Player(url).connect(this.distortion);
    }

    schedule(time: Tone.Unit.Time) {
        this.player.start(time);
    }

    toDBObject() {
        return {
            kind: this.kind,
            uuid: this.getUuid(),
            name: this.getName(),
            screenName: 'TODO',
            parameters: this.getAllParameterConfigs(),
            buf: new Blob(),
        };
    }

    static from(dbo: ITonePlayerDBObject) {
        return new TonePlayer(
            URL.createObjectURL(dbo.buf),
            {
                uuid: dbo.uuid,
                name: dbo.name,
            }
        );
    }

    static fromFile(file: File) {
        return new TonePlayer(
            URL.createObjectURL(file),
            {
                name: file.name,
            }
        );
    }
}

interface ConjunctionOptions extends BaseInstrumentOptions {

}

export class Conjunction extends BaseInstrument {
    kind: 'Conjunction';
    instrument1: IInstrument;
    instrument2: IInstrument;

    constructor(instrument1: IInstrument, instrument2: IInstrument, options: ConjunctionOptions = {}) {
        // return list of InstrumentParameters for passing to parent
        function getInstrumentParameters(ins: IInstrument) {
            return ins.getAllParameterNames().map(pname => {
                ins.getParameter(pname).setName(`${ins.getName()}-${pname}`)
                return ins.getParameter(pname)
            });
        }

        super(
            [
                ...getInstrumentParameters(instrument1),
                ...getInstrumentParameters(instrument2),
            ],
            {
                name: options.name ? options.name : `Conjunction-${instrument1.getName()}-${instrument2.getName()}`,
            }
        );

        this.kind = 'Conjunction';
        this.instrument1 = instrument1;
        this.instrument2 = instrument2;
    }

    schedule(time: Tone.Unit.Time) {
        this.instrument1.schedule(time);
        this.instrument2.schedule(time);
    }

    toDBObject() {
        return {
            kind: this.kind,
            uuid: this.getUuid(),
            name: this.getName(),
            screenName: 'TODO',
            parameters: this.getAllParameterConfigs(),
            i1: this.instrument1.toDBObject(),
            i2: this.instrument2.toDBObject(),
        };
    }
}
