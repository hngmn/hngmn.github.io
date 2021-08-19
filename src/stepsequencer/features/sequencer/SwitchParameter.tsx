'use strict';

import type { ISwitchParameterConfig } from '../instruments/classes';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import Switch from 'react-switch';

import { useAppDispatch, RootState } from '../../app/store';
import {
    // actions
    updateInstrumentParameter,

    // selectors
    selectInstrumentParameter
} from '../instruments/instrumentsSlice';

interface Props {
    instrumentId: string,
    parameterName: string,
}

export default function SwitchParameter(props: Props) {
    const {
        instrumentId,
        parameterName,
    } = props;

    const param = useSelector((state: RootState) => selectInstrumentParameter(state, instrumentId, parameterName) as ISwitchParameterConfig);

    const dispatch = useAppDispatch();

    return (
        <div className={classnames('switch', parameterName)}>
            <label htmlFor={parameterName}>{parameterName}</label>
            <Switch
                name={parameterName}
                checked={param.value}
                onChange={(checked) => dispatch(updateInstrumentParameter(instrumentId, parameterName, checked))}
            />
        </div>
    );
}
