'use strict';

import React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad';
import { useDispatch, useSelector } from 'react-redux';

import {
    padClick,
} from './sequencerSlice';

export default function InstrumentControl(props) {
    const {
        instrumentName,
        onInput,
    } = props;

    const instrument = useSelector((state) => state.sequencer.instruments.byId[instrumentName]);
    const dispatch = useDispatch();

    return (
        <span>
            <span>{instrument.name}</span>

            <InstrumentParameters
                params={instrument.params.allIds.map((id) => instrument.params.byId[id])}
                onInput={onInput}
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
