'use strict';

import type {
    Unit,
} from 'tone';
import { v4 as uuid } from 'uuid';
import * as Tone from 'tone';

import type { INormalizedObject } from '../../../global'
import { put } from '../../../util/util';
import type { ITonePlayerDBObject } from './TonePlayer';
import type { IToneSynthDBObject } from './ToneSynth';
import type { IConjunctionDBObject } from './Conjunction';
import type { IDisjunctionDBObject } from './Disjunction';
import {
    IInstrumentParameter,
    IInstrumentParameterConfig,

    SliderParameter,
} from './InstrumentParameter';


type IInstrumentKind = 'ToneSynth' | 'TonePlayer' | 'Conjunction' | 'Disjunction';

export interface IInstrument {
    getKind: () => IInstrumentKind;
    getUuid: () => string;
    getName: () => string;
    setName: (newName: string) => void;
    getAllParameterNames: () => Array<string>;
    getParameter: (parameterName: string) => IInstrumentParameter,
    getParameterConfig: (parameterName: string) => IInstrumentParameterConfig;
    getParameterValue: (parameterName: string) => boolean | number;
    setParameterValue: (parameterName: string, value: boolean | number) => void;

    setSolo: (s: boolean) => void;
    setMute: (m: boolean) => void;
    schedule: (time: Unit.Time) => void;

    // for idb storage
    toDBObject: () => IInstrumentDBObject;
}

export type IInstrumentDBObject = ITonePlayerDBObject | IToneSynthDBObject | IConjunctionDBObject | IDisjunctionDBObject;

export interface BaseInstrumentOptions {
    uuid?: string
    name?: string
}

export interface IBaseInstrumentDBObject {
    kind: IInstrumentKind;
    uuid: string;
    name: string;
    screenName: string;
    parameters: Array<IInstrumentParameterConfig>;
}

export abstract class BaseInstrument implements IInstrument {
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
            (v: number) => this.channel.set({pan: v})
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

    abstract toDBObject(): IInstrumentDBObject;
    abstract schedule(time: Unit.Time): void;
}

