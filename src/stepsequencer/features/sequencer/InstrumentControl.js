'use strict';

import React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad.js';
import { useDispatch } from 'react-redux';

import {
    padClick,
} from './sequencerSlice';

export default function InstrumentControl(props) {
    const {
        instrument,
        onInput,
    } = props;

    const dispatch = useDispatch();

    return (
        <span>
            <span>{instrument.name}</span>

            <InstrumentParameters
                params={instrument.params.allNames.map((id) => instrument.params.byName[id])}
                onInput={(parameterName, value) => onInput(instrument.name, parameterName, value)}
            />

            {instrument.pads.map((padIsOn, index) => (
                <Pad
                    key={`${instrument.name}${index}`}
                    isOn={padIsOn}
                    onClick={() => dispatch(padClick(instrument.name, index))}
                />
            ))}
        </span>
    );
}
