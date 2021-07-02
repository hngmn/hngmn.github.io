'use strict';

import type {
    Unit,
} from 'tone';

import { NormalizedObject } from '../../global'

export interface IInstrumentParameter {
    getValue: () => number;
    setValue: (value: number) => void;
}

export interface IInstrumentParameterConfig {
    name: string;
    min: number;
    max: number;
    value: number;
    step: number;
}

export interface IInstrument {
    schedule: (time: Unit.Time) => void;
    getAllParameterNames: () => Array<string>;
    getParameterConfig: (parameterName: string) => IInstrumentParameterConfig;
    getParameterValue: (parameterName: string) => number;
    setParameterValue: (parameterName: string, value: number) => void;
}

