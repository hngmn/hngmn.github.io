'use strict';

import { NormalizedObject } from '../../global'

export interface IInstrumentParameter {
    name: string,
    min: number,
    max: number,
    value: number,
    step: number,
}

export interface IInstrument {
    schedule: (time: number) => void,
    getAllParameterNames: () => Array<string>,
    getParameterConfig: (parameterName: string) => IInstrumentParameter,
    getParameterValue: (parameterName: string) => number,
    setParameterValue: (parameterName: string, value: number) => void,
}

