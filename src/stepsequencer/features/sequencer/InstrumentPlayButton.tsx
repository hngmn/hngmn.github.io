'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import { playInstrument } from '../instruments/instrumentsSlice';

interface Props {
    instrumentId: string,
}

export default function InstrumentPlayButton(props: Props) {
    const {
        instrumentId,
    } = props;

    const dispatch = useAppDispatch();

    const className = classnames('instrumentPlayButton');

    return (
        <button
            className={className}
            onClick={ () => dispatch(playInstrument(instrumentId)) }
        >
            play
        </button>
   )
}
