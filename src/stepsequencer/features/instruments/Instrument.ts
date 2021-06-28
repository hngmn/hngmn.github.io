'use strict';

import { INormalizedObject } from '../../global'
import {
    IInstrument,
    IInstrumentParameter,
} from './types';

export abstract class BaseInstrument implements IInstrument {
    params: INormalizedObject<InstrumentParameter>;

    constructor(params: Array<IInstrumentParameter>) {
        this.params = {
            byId: {},
            allIds: params.map(p => p.name)
        };
        for (let p of params) {
            this.params.byId[p.name] = new InstrumentParameter(
                p.name,
                p.min,
                p.max,
                p.value,
                p.step
            );
        }
    }

    getAllParameterNames() {
        return this.params.allIds;
    }

    getParameterConfig(parameterName: string) {
        return {
            name: this.params.byId[parameterName].name,
            min: this.params.byId[parameterName].min,
            max: this.params.byId[parameterName].max,
            value: this.params.byId[parameterName].value,
            step: this.params.byId[parameterName].step,
        }
    }

    getParameterValue(parameterName: string) {
        return this.params.byId[parameterName].value;
    }

    setParameterValue(parameterName: string, value: number) {
        this.params.byId[parameterName].value = value;
    }

    abstract schedule(time: number): void;
}

export class InstrumentParameter implements IInstrumentParameter {
    name: string;
    min: number;
    max: number;
    value: number;
    step: number;

    constructor(
        name: string,
        min: number,
        max: number,
        initialValue: number,
        step: number,
    ) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.value = initialValue;
        this.step = step;
    }

    getValue() {
        return this.value;
    }

    setValue(value: number) {
        this.value = value;
    }
}
