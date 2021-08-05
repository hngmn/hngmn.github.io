'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import {
    selectInstrumentScreenName,
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

    const instrumentName = useSelector((state: RootState) => selectInstrumentScreenName(state, instrumentId));

    const className = classnames('quickControls');
    return (
        <section className={className}>
            <button
                className={classnames('quickControlButton', 'solo')}
                onClick={ () => console.log(`${instrumentName} solo`) }
            >
                solo
            </button>

            <button
                className={classnames('quickControlButton', 'mute')}
                onClick={ () => console.log(`${instrumentName} mute`) }
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
