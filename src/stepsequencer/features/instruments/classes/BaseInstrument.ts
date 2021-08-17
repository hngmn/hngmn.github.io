'use strict';

import type {
    Unit,
} from 'tone';
import { v4 as uuid } from 'uuid';

import type { INormalizedObject } from '../../../global'
import type {
    IInstrument,
    IInstrumentKind,
    IInstrumentParameter,
    IInstrumentParameterConfig,
    IInstrumentDBObject,
} from '../types';
import { SliderParameter } from './InstrumentParameter';

export interface BaseInstrumentOptions {
    uuid?: string
    name?: string
}

export default abstract class BaseInstrument implements IInstrument {
    abstract kind: IInstrumentKind;
    uuid: string;
    name: string;
    params: INormalizedObject<IInstrumentParameter>;

    constructor(params: Array<IInstrumentParameter>, options: BaseInstrumentOptions = {}) {
        this.uuid = options.uuid ? options.uuid : uuid();
        this.name = options.name ? options.name : this.uuid;

        this.params = {
            byId: {},
            allIds: params.map(p => p.getName())
        };
        for (let p of params) {
            this.params.byId[p.getName()] = p;
        }
    }

    getKind() {
        return this.kind;
    }

    getUuid() {
        return this.uuid;
    }

    getName() {
        return this.name;
    }

    setName(newName: string) {
        this.name = newName;
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

    getAllParameterConfigs() {
        return this.params.allIds.map(id => this.params.byId[id].toConfigObject());
    }

    abstract schedule(time: Unit.Time): void;
    abstract toDBObject(): IInstrumentDBObject;
}

