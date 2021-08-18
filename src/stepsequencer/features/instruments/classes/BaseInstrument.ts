'use strict';

import type {
    Unit,
} from 'tone';
import { v4 as uuid } from 'uuid';
import * as Tone from 'tone';

import type { INormalizedObject } from '../../../global'
import type {
    IInstrument,
    IInstrumentKind,
    IInstrumentParameter,
    IInstrumentParameterConfig,
    IInstrumentDBObject,
} from '../types';
import { put } from '../../../util/util';
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
    channel: Tone.Channel;

    constructor(params: Array<IInstrumentParameter>, options: BaseInstrumentOptions = {}) {
        this.uuid = options.uuid ? options.uuid : uuid();
        this.name = options.name ? options.name : this.uuid;

        this.params = {
            byId: {},
            allIds: [],
        };

        // put channel params
        this.channel = new Tone.Channel(0, 0);
        this.channel.toDestination();
        const vol = new SliderParameter(
            {
                kind: 'slider',
                name: 'volume',
                min: -36,
                max: 12,
                value: 0,
                step: 0.1,
            },
            (v: number) => this.channel.set({ volume: v })
        );
        const pan = new SliderParameter(
            {
                kind: 'slider',
                name: 'pan',
                min: -1,
                max: 1,
                value: 0,
                step: 0.1
            },
            (v: number) => this.channel.set({volume: v})
        );

        put(this.params, vol.getName(), vol);
        put(this.params, pan.getName(), pan);
        
        for (let p of params) {
            put(this.params, p.getName(), p);
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

    setSolo(s: boolean) {
        this.channel.solo = s;
    }

    setMute(m: boolean) {
        this.channel.mute = m;
    }

    abstract schedule(time: Unit.Time): void;
    abstract toDBObject(): IInstrumentDBObject;
}

