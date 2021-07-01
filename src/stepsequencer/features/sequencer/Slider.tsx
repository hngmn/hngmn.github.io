'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../app/store';
import { IInstrumentParameterConfig } from '../instruments/types';

interface BaseProps {
    kind: 'selector' | 'object';
    onInput: (value: number) => void;
}

interface PropsFromSelector extends BaseProps {
    kind: 'selector';
    selector: (state: RootState) => IInstrumentParameterConfig;
}

interface PropsFromObject extends BaseProps {
    kind: 'object';
    config: {
        name: string,
        min: number,
        max: number,
        value: number,
        step: number,
    };
}

/**
 * Slider component
 */
export default function Slider(props: PropsFromSelector | PropsFromObject) {
    let sliderProps;
    switch (props.kind) {
    case 'selector':
        sliderProps = useSelector(props.selector);
        break;
    case 'object':
        sliderProps = (props as PropsFromObject).config;
    }

    const {
        name = 'defaultName?',
        min = 0, // defaults
        max = 1,
        value = 0.5,
        step = 0.1,
    } = sliderProps;

    return (
        <div>
            <label htmlFor={name}>slider for {name} ({value})</label>
            <input
                name={name}
                id={name}
                type="range"
                min={min}
                max={max}
                value={value}
                step={step}
                onInput={(e: React.FormEvent<HTMLInputElement>) => props.onInput(parseFloat((e.target as HTMLInputElement).value))}/>
        </div>
    );
}
