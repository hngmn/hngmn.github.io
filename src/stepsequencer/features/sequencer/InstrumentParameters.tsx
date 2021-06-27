'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import Slider from './Slider';
import { InstrumentParameter } from '../instruments/types';
import {
    // actions
    updateInstrumentParameter,

    // selectors
    selectParameterNamesForInstrument,
    selectInstrumentParameter
} from './sequencerSlice';

interface Props {
    instrumentName: string,
}

export default function InstrumentParameters(props: Props) {
    const {
        instrumentName,
    } = props;

    const parameterNames = useSelector((state: RootState) => selectParameterNamesForInstrument(state, instrumentName));
    const dispatch = useAppDispatch();

    return (
        <span>
            {parameterNames.map((parameterName) => {
                return (
                    <Slider
                        key={parameterName}
                        kind={'selector'}
                        selector={(state: RootState) => selectInstrumentParameter(state, instrumentName, parameterName)}
                        onInput={(value: number) => dispatch(updateInstrumentParameter(instrumentName, parameterName, value))}
                    />
                );
            })}
        </span>
    );
}
