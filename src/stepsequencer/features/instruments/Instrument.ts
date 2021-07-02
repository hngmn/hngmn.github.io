'use strict';

import type {
    Unit,
} from 'tone';

import type { INormalizedObject } from '../../global'
import type {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from './types';

export abstract class BaseInstrument implements IInstrument {
    params: INormalizedObject<InstrumentParameter>;

    constructor(params: Array<IInstrumentParameterConfig>) {
        this.params = {
            byId: {},
            allIds: params.map(p => p.name)
        };
        for (let p of params) {
            this.params.byId[p.name] = new InstrumentParameter(p);
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

    abstract schedule(time: Unit.Time): void;
}

export class InstrumentParameter implements IInstrumentParameter {
    name: string;
    min: number;
    max: number;
    value: number;
    step: number;

    constructor(config: IInstrumentParameterConfig) {
        this.name = config.name;
        this.min = config.min;
        this.max = config.max;
        this.value = config.value;
        this.step = config.step;
    }

    getValue() {
        return this.value;
    }

    setValue(value: number) {
        this.value = value;
    }
}
