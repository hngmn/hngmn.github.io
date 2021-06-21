'use strict';

import React, { useState } from 'react';

import Slider from './Slider';

export default function InstrumentParameters(props) {
    const {
        params,
    } = props;

    return (
        <div>
            {params.map((param) => {
                return (
                    <Slider
                        key={param.name}
                        param={param}
                    />
                );
            })}
        </div>
    );
}
