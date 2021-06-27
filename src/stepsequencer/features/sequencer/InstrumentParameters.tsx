'use strict';

import React, { useState } from 'react';

import Slider from './Slider';
import { InstrumentParameter } from '../instruments/types';

interface Props {
    params: [InstrumentParameter],
    onInput: (parameterName: string, value: number) => void,
}

export default function InstrumentParameters(props: Props) {
    const {
        params,
        onInput,
    } = props;

    return (
        <span>
            {params.map((param) => {
                return (
                    <Slider
                        key={param.name}
                        param={param}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => onInput(param.name, parseFloat((e.target as HTMLInputElement).value))}
                    />
                );
            })}
        </span>
    );
}
