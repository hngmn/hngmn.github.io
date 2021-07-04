'use strict';

import {
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from '../types';

export default class InstrumentParameter implements IInstrumentParameter {
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
