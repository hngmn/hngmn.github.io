'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import type { ISliderParameterConfig } from '../instruments/classes';
import {
    // actions
    updateInstrumentParameter,

    // selectors
    selectParameterNamesForInstrument,
    selectInstrumentParameter
} from '../instruments/instrumentsSlice';
import { SelectorSlider } from './Slider';
import SwitchParameter from './SwitchParameter';

interface Props {
    instrumentId: string,
    parameterName: string,
}

export default function InstrumentParameter(props: Props) {
    const {
        instrumentId,
        parameterName,
    } = props;

    const param = useSelector((state: RootState) => selectInstrumentParameter(state, instrumentId, parameterName));

    const dispatch = useAppDispatch();

    switch (param.kind) {
    case 'slider':
        return (<SelectorSlider
            selector={(state: RootState) =>
                selectInstrumentParameter(state, instrumentId, parameterName) as ISliderParameterConfig}
            onInput={(value: number) => dispatch(updateInstrumentParameter(instrumentId, parameterName, value))}
        />);
        break;
    case 'switch':
        return (<SwitchParameter instrumentId={instrumentId} parameterName={param.name}/>);
        break;
    default:
        throw new Error('unexpected param kind');
        break;
    }
}
