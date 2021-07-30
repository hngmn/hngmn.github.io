'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../app/store';
import { IInstrumentParameterConfig } from '../instruments/types';

interface SliderProps extends IInstrumentParameterConfig {
    onInput: (value: number) => void;
    classNames?: Array<String>;
}

/**
 * Slider component
 */
export default function Slider(props: SliderProps) {
    const {
        name,
        min = 0, // defaults
        max = 1,
        value = 0.5,
        step = 0.1,
        onInput,
        classNames = [],
    } = props;

    const className = classnames('slider', name, ...classNames);

    return (
        <div className={className}>
            <label htmlFor={name}>{name} ({value})</label>
            <input
                name={name}
                id={name}
                type="range"
                min={min}
                max={max}
                value={value}
                step={step}
                onInput={(e: React.FormEvent<HTMLInputElement>) => onInput(parseFloat((e.target as HTMLInputElement).value))}/>
        </div>
    );
}


// Selector Slider

interface PropsFromSelector {
    onInput: (value: number) => void;
    selector: (state: RootState) => IInstrumentParameterConfig;
}

/**
 * Compose Slider. Pass in a Selector function to fill the IInstrumentParameterConfig values
 */
export function SelectorSlider(props: PropsFromSelector) {
    return (<Slider classNames={['instrumentParameter']} onInput={props.onInput} {...useSelector(props.selector)}/>);
}
