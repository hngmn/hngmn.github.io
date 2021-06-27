'use strict';

import * as React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad';
import { useDispatch, useSelector } from 'react-redux';

import {
    padClick,
} from './sequencerSlice';

interface Props {
    instrumentName: string,
    onInput: (parameterName: string, value: number) => void,
}

export default function InstrumentControl(props: Props) {
    const {
        instrumentName,
        onInput,
    } = props;

    const instrument = useSelector((state: any) => state.sequencer.instruments.byId[instrumentName]);
    const dispatch = useDispatch();

    return (
        <span>
            <span>{instrument.name}</span>

            <InstrumentParameters
                params={instrument.params.allIds.map((id: string) => instrument.params.byId[id])}
                onInput={onInput}
            />

            {instrument.pads.map((padIsOn: boolean, index: number) => (
                <Pad
                    key={`${instrument.name}${index}`}
                    isOn={padIsOn}
                    onClick={() => dispatch(padClick(instrument.name, index))}
                />
            ))}
        </span>
    );
}
