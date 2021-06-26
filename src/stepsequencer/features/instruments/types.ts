'use strict';

export type InstrumentParameter = {
    name: string,
    min: number,
    max: number,
    value: number,
    step: number,
};

export type Instrument = {
    name: string,
    schedule: (time: number) => void,
    setParameter: (parameterName: string, value: number) => void,
};
