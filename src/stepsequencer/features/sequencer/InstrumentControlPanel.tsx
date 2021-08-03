'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import { removeInstrument, selectInstrumentScreenName } from '../instruments/instrumentsSlice';
import InstrumentParameters from './InstrumentParameters';

interface Props {
    instrumentId: string,
}

export default function InstrumentControlPanel(props: Props) {
    const {
        instrumentId,
    } = props;

    const screenName = useSelector((state: RootState) => selectInstrumentScreenName(state, instrumentId));

    const dispatch = useAppDispatch();

    const panelClassname = classnames('track', 'controlPanel');
    return (
        <section className={panelClassname}>
            <button
                className={classnames('removeInstrumentButton')}
                onClick={(e => dispatch(removeInstrument(instrumentId)))}
            >
                x
            </button>

            <span className={classnames('instrumentLabel')}>{screenName}</span>

            <InstrumentParameters instrumentId={instrumentId}/>
        </section>
    );
}
