'use strict';

export interface InstrumentParameter {
    name: string,
    min: number,
    max: number,
    value: number,
    step: number,
}

export interface Instrument {
    name: string,
    schedule: (time: number) => void,
    setParameter: (parameterName: string, value: number) => void,
}
