'use strict';

export interface InstrumentParameter {
    name: string,
    min: number,
    max: number,
    value: number,
    step: number,
}

export interface Instrument extends InstrumentConfig {
    schedule: (time: number) => void,
    setParameter: (parameterName: string, value: number) => void,
}

export interface InstrumentConfig {
    name: string,
    params: Map<string, InstrumentParameter>,
    pads: Array<boolean>,
}
