'use strict';

import * as React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import { InstrumentConfig } from '../instruments/types';
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

    const instrument = useSelector((state: RootState) => state.sequencer.instruments.get(instrumentName) as InstrumentConfig);
    const pads = useSelector((state: RootState) => state.sequencer.pads.get(instrumentName) as Array<boolean>);
    const dispatch = useAppDispatch();

    return (
        <span>
            <span>{instrument.name}</span>

            <InstrumentParameters
                params={Array.from(instrument.params.values())}
                onInput={onInput}
            />

            {pads.map((padIsOn: boolean, index: number) => (
                <Pad
                    key={`${instrument.name}${index}`}
                    isOn={padIsOn}
                    onClick={() => dispatch(padClick(instrument.name, index))}
                />
            ))}
        </span>
    );
}
