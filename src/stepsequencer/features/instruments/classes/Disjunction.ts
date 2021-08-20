'use strict';

import * as Tone from 'tone';

import { IInstrument, IInstrumentDBObject } from './BaseInstrument';
import { SliderParameter, SwitchParameter } from './InstrumentParameter';
import {
    BaseInstrument,
    BaseInstrumentOptions,
    IBaseInstrumentDBObject
} from './BaseInstrument';
import { dboToInstrument } from './toneInstruments';


export interface IDisjunctionDBObject extends IBaseInstrumentDBObject {
    kind: 'Disjunction';
    i1: IInstrumentDBObject;
    i2: IInstrumentDBObject;
}

interface DisjunctionOptions extends BaseInstrumentOptions {
}

export class Disjunction extends BaseInstrument {
    kind: 'Disjunction';
    instrument1: IInstrument;
    instrument2: IInstrument;
    distribution: [number, number];

    constructor(instrument1: IInstrument, instrument2: IInstrument, options: DisjunctionOptions = {}) {
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
                name: options.name ? options.name : `Disjunction-${instrument1.getName()}-${instrument2.getName()}`,
            }
        );

        this.kind = 'Disjunction';
        this.instrument1 = instrument1;
        this.instrument2 = instrument2;
        this.distribution = [0.80, 0.2];
    }

    schedule(time: Tone.Unit.Time) {
        const randIns = this.pickRandom<IInstrument, 2>([this.instrument1, this.instrument2], this.distribution);

        randIns.schedule(time);
    }

    pickRandom<T extends any, N extends number>(items: NTuple<T, N>, distribution: NTuple<number, N>): T {
        const probabilityFirst = distribution[0];
        const x = Math.random();
        if (x < probabilityFirst) {
            return items[0];
        } else {
            return items[1];
        }
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

    static async from(dbo: IDisjunctionDBObject) {
        const i1Result = await dboToInstrument(dbo.i1);
        if (i1Result.err) {
            console.error('Got error creating i1: ', i1Result.val);
            throw i1Result.val;
        }
        const i1 = i1Result.unwrap();

        const i2Result = await dboToInstrument(dbo.i2);
        if (i2Result.err) {
            console.error('Got error creating i2: ', i2Result.val);
            throw i2Result.val;
        }
        const i2 = i2Result.unwrap();

        return new Disjunction(i1, i2);
    }
}

interface NTuple<T extends any, N extends number> extends Array<T> {
    0: T;
    length: N;
}

