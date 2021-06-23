'use strict';

import React, { useState } from 'react';

import Slider from './Slider';

export default function InstrumentParameters(props) {
    const {
        params,
        onInput,
    } = props;

    return (
        <div>
            {params.map((param) => {
                return (
                    <Slider
                        key={param.name}
                        param={param}
                        onInput={(e) => onInput(param.name, e.target.value)}
                    />
                );
            })}
        </div>
    );
}
