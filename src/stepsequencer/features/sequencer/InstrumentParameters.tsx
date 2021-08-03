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
    instrumentId: string,
}

export default function InstrumentParameters(props: Props) {
    const {
        instrumentId,
    } = props;

    const parameterNames = useSelector((state: RootState) => selectParameterNamesForInstrument(state, instrumentId));
    const dispatch = useAppDispatch();

    return (
        <>
            {parameterNames.map((parameterName) => {
                return (
                    <SelectorSlider
                        key={parameterName}
                        selector={(state: RootState) => selectInstrumentParameter(state, instrumentId, parameterName)}
                        onInput={(value: number) => dispatch(updateInstrumentParameter(instrumentId, parameterName, value))}
                    />
                );
            })}
        </>
    );
}
