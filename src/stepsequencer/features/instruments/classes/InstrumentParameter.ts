'use strict';

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

abstract class BaseInstrumentParameter implements IInstrumentParameter {
    name: string;
    value: boolean | number;
    update: (v: boolean | number) => void;

    constructor(config: IInstrumentParameterConfig, updateCallback: (v: boolean | number) => void) {
        this.name = config.name;
        this.value = config.value;
        this.update = updateCallback;
    }

    getName() {
        return this.name;
    }

    setName(name: string) {
        this.name = name;
    }

    getValue() {
        return this.value;
    }

    setValue(value: boolean | number) {
        this.value = value;
        this.update(value);
    }

    abstract toConfigObject(): IInstrumentParameterConfig;
}

export class SliderParameter extends BaseInstrumentParameter {
    kind: 'slider';
    min: number;
    max: number;
    step: number;

    constructor(config: ISliderParameterConfig, updateCallback: (v: number) => void) {
        super(config, (v: boolean | number) => updateCallback(v as number));

        this.kind = 'slider';
        this.name = config.name;
        this.min = config.min;
        this.max = config.max;
        this.value = config.value;
        this.step = config.step;
    }

    toConfigObject() {
        return {
            kind: this.kind,
            name: this.name,
            value: this.value as number,
            min: this.min,
            max: this.max,
            step: this.step,
        };
    }
}

export class SwitchParameter extends BaseInstrumentParameter {
    kind: 'switch';

    constructor(config: ISwitchParameterConfig, updateCallback: (v: boolean) => void) {
        super(config, (v: boolean | number) => updateCallback(v as boolean));

        this.kind = 'switch';
    }

    toConfigObject() {
        return {
            kind: this.kind,
            name: this.name,
            value: this.value as boolean,
        };
    }
}
