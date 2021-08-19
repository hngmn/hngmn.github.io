'use strict';

import * as Tone from 'tone';

import { IInstrument, IInstrumentDBObject } from './BaseInstrument';
import { SliderParameter, SwitchParameter } from './InstrumentParameter';
import {
    BaseInstrument,
    BaseInstrumentOptions,
    IBaseInstrumentDBObject
} from './BaseInstrument';


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

