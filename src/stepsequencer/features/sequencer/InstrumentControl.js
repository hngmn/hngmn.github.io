'use strict';

import React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad.js';

export default function InstrumentControl(props) {
    const {
        instrument,
        onInput,
    } = props;

    return (
        <span>
            <InstrumentParameters
                params={instrument.params.allNames.map((id) => instrument.params.byName[id])}
                onInput={(parameterName, value) => onInput(instrument.name, parameterName, value)}
            />

            {instrument.pads.map((padIsOn, index) => (
                <Pad
                    key={`${instrument.name}${index}`}
                    isOn={padIsOn}
                    onClick={() => {console.log(`${instrument.name} pad ${index} clicked`);}}
                />
            ))}
        </span>
    );
}
