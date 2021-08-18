'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import {
    soloInstrument,
    muteInstrument,

    selectInsSolo,
    selectInsMuted,
} from '../instruments/instrumentsSlice';

interface Props {
    instrumentId: string,
    onEdit: () => void,
}

export default function InstrumentQuickControls(props: Props) {
    const {
        instrumentId,
        onEdit,
    } = props;

    const solo = useSelector((state: RootState) => selectInsSolo(state, instrumentId));
    const muted = useSelector((state: RootState) => selectInsMuted(state, instrumentId));
    const dispatch = useAppDispatch();

    const className = classnames('quickControls');
    return (
        <section className={className}>
            <button
                className={classnames('quickControlButton', 'solo', solo ? 'on' : 'off')}
                onClick={ () => dispatch(soloInstrument(instrumentId)) }
            >
                solo
            </button>

            <button
                className={classnames('quickControlButton', 'mute', muted ? 'on' : 'off')}
                onClick={ () => dispatch(muteInstrument(instrumentId)) }
            >
                mute
            </button>

            <button
                className={classnames('quickControlButton', 'edit')}
                onClick={onEdit}
            >
                edit
            </button>
        </section>
    );
}
