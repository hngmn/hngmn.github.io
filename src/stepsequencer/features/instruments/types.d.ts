'use strict';

import type {
    Unit,
} from 'tone';

import { NormalizedObject } from '../../global'

export interface IInstrumentParameter {
    getName: () => string;
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

export interface IInstrument {
    getUuid: () => string;
    getAllParameterNames: () => Array<string>;
    getParameterConfig: (parameterName: string) => IInstrumentParameterConfig;
    getParameterValue: (parameterName: string) => boolean | number;
    setParameterValue: (parameterName: string, value: boolean | number) => void;

    schedule: (time: Unit.Time) => void;
}

