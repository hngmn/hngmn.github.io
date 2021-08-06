'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import { selectParameterNamesForInstrument } from '../instruments/instrumentsSlice';
import InstrumentParameter from './InstrumentParameter';

interface Props {
    instrumentId: string,
}

export default function InstrumentParameters(props: Props) {
    const {
        instrumentId,
    } = props;

    const parameterNames = useSelector((state: RootState) => selectParameterNamesForInstrument(state, instrumentId));

    return (
        <section className={classnames('instrumentParameters')}>
            {parameterNames.map((parameterName) => {
                return (<InstrumentParameter key={parameterName} {...{ instrumentId, parameterName }}/>);
            })}
        </section>
    );
}
