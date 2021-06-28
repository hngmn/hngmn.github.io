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
    setParameter: (parameterName: string, value: number) => void,
    params: NormalizedObject<InstrumentParameter>,
}

