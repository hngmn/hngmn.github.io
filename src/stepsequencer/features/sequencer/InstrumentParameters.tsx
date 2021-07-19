'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import { SelectorSlider } from './Slider';
import {
    // actions
    updateInstrumentParameter,

    // selectors
    selectParameterNamesForInstrument,
    selectInstrumentParameter
} from '../instruments/instrumentsSlice';

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
        <>
            {parameterNames.map((parameterName) => {
                return (
                    <SelectorSlider
                        key={parameterName}
                        selector={(state: RootState) => selectInstrumentParameter(state, instrumentName, parameterName)}
                        onInput={(value: number) => dispatch(updateInstrumentParameter(instrumentName, parameterName, value))}
                    />
                );
            })}
        </>
    );
}
