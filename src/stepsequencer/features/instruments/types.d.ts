'use strict';

import type {
    Unit,
} from 'tone';

import { NormalizedObject } from '../../global'

export interface IInstrumentParameter {
    getName: () => string;
    setName: (name: string) => void;
    getValue: () => boolean | number;
    setValue: (value: boolean | number) => void;
    toConfigObject: () => IInstrumentParameterConfig;
}

export type IInstrumentParameterConfig = ISwitchParameterConfig | ISliderParameterConfig;

export interface ISwitchParameterConfig {
    kind: 'switch';
    name: string;
    value: boolean;
}

export interface ISliderParameterConfig {
    kind: 'slider';
    name: string;
    value: number;
    min: number;
    max: number;
    step: number;
}

type IInstrumentKind = 'ToneSynth' | 'TonePlayer' | 'Conjunction';

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

    schedule: (time: Unit.Time) => void;

    // for idb storage
    toDBObject: () => IInstrumentDBObject;
}

export type IInstrumentDBObject = ITonePlayerDBObject | IToneSynthDBObject | IConjunctionDBObject;

export interface IBaseInstrumentDBObject {
    kind: IInstrumentKind;
    uuid: string;
    name: string;
    screenName: string;
    parameters: Array<IInstrumentParameterConfig>;
}

export interface ITonePlayerDBObject extends IBaseInstrumentDBObject {
    kind: 'TonePlayer';
    buf: ArrayBuffer;
    nChannels: number;
    length: number;
    sampleRate: number;
}

export interface IToneSynthDBObject extends IBaseInstrumentDBObject {
    kind: 'ToneSynth';
}

export interface IConjunctionDBObject extends IBaseInstrumentDBObject {
    kind: 'Conjunction';
    i1: IInstrumentDBObject;
    i2: IInstrumentDBObject;
}
