'use strict';

import type {
    Unit,
} from 'tone';

import type { INormalizedObject } from '../../../global'
import type {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from '../types';
import InstrumentParameter from './InstrumentParameter';

export default abstract class BaseInstrument implements IInstrument {
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

