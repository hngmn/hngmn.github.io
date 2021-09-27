'use strict';

import * as Tone from 'tone';

import { IInstrument, IInstrumentDBObject } from './BaseInstrument';
import {
    BaseInstrument,
    BaseInstrumentOptions,
    IBaseInstrumentDBObject
} from './BaseInstrument';
import { dboToInstrument } from './toneInstruments';


export interface IConjunctionDBObject extends IBaseInstrumentDBObject {
    kind: 'Conjunction';
    i1: IInstrumentDBObject;
    i2: IInstrumentDBObject;
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

        if (!options.name) {
            options.name = `Conjunction-${instrument1.getName()}-${instrument2.getName()}`;
        }

        super(
            [
                ...getInstrumentParameters(instrument1),
                ...getInstrumentParameters(instrument2),
            ],
            options
        );

        this.kind = 'Conjunction';
        this.instrument1 = instrument1;
        this.instrument2 = instrument2;
    }

    schedule(time: Tone.Unit.Time): void {
        this.instrument1.schedule(time);
        this.instrument2.schedule(time);
    }

    toDBObject(): IConjunctionDBObject {
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

    static async from(dbo: IConjunctionDBObject): Promise<Conjunction> {
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

        return new Conjunction(
            i1,
            i2,
            {
                uuid: dbo.uuid,
                name: dbo.name,
            }
        );
    }
}

