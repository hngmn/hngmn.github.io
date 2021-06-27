'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import range from '../../util/range';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad';
import {
    // actions
    updateInstrumentParameter,
    padClick,

    // selectors
    selectNumberOfBeats,
} from './sequencerSlice';

interface Props {
    instrumentName: string,
}

export default function InstrumentControl(props: Props) {
    const {
        instrumentName,
    } = props;

    const nPads = useSelector(selectNumberOfBeats);
    const dispatch = useAppDispatch();

    return (
        <span>
            <span>{instrumentName}</span>

            <InstrumentParameters
                instrumentName={instrumentName}
            />

            {Array.from(range(1, nPads)).map(index => (
                <Pad
                    key={`${instrumentName}${index}`}
                    instrumentName={instrumentName}
                    padi={index}
                />
            ))}
        </span>
    );
}
