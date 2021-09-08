'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import useKeyboardShortcut from '../../util/useKeyboardShortcut';
import { playInstrument } from '../instruments/instrumentsSlice';

interface Props {
    instrumentId: string,
    keyboardShortcut?: string,
}

export default function InstrumentPlayButton(props: Props) {
    const {
        instrumentId,
        keyboardShortcut = 's',
    } = props;

    const dispatch = useAppDispatch();

    const className = classnames('instrumentPlayButton');

    useKeyboardShortcut([keyboardShortcut], () => {
        // Only play the sample if it was explicitly requested in props
        if ('keyboardShortcut' in props) {
            dispatch(playInstrument(instrumentId));
        }
    });

    return (
        <button
            className={className}
            onClick={ () => dispatch(playInstrument(instrumentId)) }
        >
            sample
        </button>
   )
}
