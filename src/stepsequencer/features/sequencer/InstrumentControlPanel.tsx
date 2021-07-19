'use strict';

import classnames from 'classnames';
import * as React from 'react';

import { useAppDispatch } from '../../app/store';
import { removeInstrument } from '../instruments/instrumentsSlice';
import InstrumentParameters from './InstrumentParameters';

interface Props {
    instrumentName: string,
}

export default function InstrumentControlPanel(props: Props) {
    const {
        instrumentName,
    } = props;

    const dispatch = useAppDispatch();

    const panelClassname = classnames('track', instrumentName, 'controlPanel');
    return (
        <section className={panelClassname}>
            <button onClick={(e => dispatch(removeInstrument(instrumentName)))}>
                x
            </button>

            <span>{instrumentName}</span>

            <InstrumentParameters instrumentName={instrumentName}/>
        </section>
    );
}
