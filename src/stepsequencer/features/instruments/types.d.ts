'use strict';

import { NormalizedObject } from '../../global'

export interface InstrumentParameter {
    name: string,
    min: number,
    max: number,
    value: number,
    step: number,
}

export interface Instrument {
    schedule: (time: number) => void,
    setParameter: (parameterName: string, value: number) => void,
    params: NormalizedObject<InstrumentParameter>,
}

