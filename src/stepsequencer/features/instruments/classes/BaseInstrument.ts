'use strict';

import type {
    Unit,
} from 'tone';
import { v4 as uuid } from 'uuid';

import type { INormalizedObject } from '../../../global'
import type {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
} from '../types';
import { SliderParameter } from './InstrumentParameter';

export default abstract class BaseInstrument implements IInstrument {
    uuid: string;
    name: string;
    params: INormalizedObject<IInstrumentParameter>;

    constructor(params: Array<IInstrumentParameter>, name?: string) {
        this.uuid = uuid();
        this.name = name ? name : this.uuid;

        this.params = {
            byId: {},
            allIds: params.map(p => p.getName())
        };
        for (let p of params) {
            this.params.byId[p.getName()] = p;
        }
    }

    getUuid() {
        return this.uuid;
    }

    getName() {
        return this.name;
    }

    getAllParameterNames() {
        return this.params.allIds;
    }

    getParameter(parameterName: string) {
        return this.params.byId[parameterName];
    }

    getParameterConfig(parameterName: string) {
        return this.params.byId[parameterName].toConfigObject();
    }

    getParameterValue(parameterName: string) {
        return this.params.byId[parameterName].getValue();
    }

    setParameterValue(parameterName: string, value: boolean | number) {
        this.params.byId[parameterName].setValue(value);
    }

    abstract schedule(time: Unit.Time): void;
}

