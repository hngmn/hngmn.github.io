'use strict';

import React, { useState } from 'react';

import Slider from './Slider';

export default function InstrumentParameters(props) {
    return (
        <div>
            {props.instrument.params.map((param) => {
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
