'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';

import './Pad.css';
import { useAppDispatch, RootState } from '../../app/store';
import {
    // actions
    padClick,

    // selectors
    selectPad,
} from './sequencerSlice';

interface Props {
    instrumentName: string,
    padi: number
}

export default function Pad(props: Props) {
    const {
        instrumentName,
        padi,
    } = props;

    const isOn = useSelector((state: RootState) => selectPad(state, instrumentName, padi));
    const dispatch = useAppDispatch();

    const className = isOn ? 'padOn' : 'padOff';

    return (
        <button
            className={className}
            onClick={() => dispatch(padClick(instrumentName, padi))}
        />
    );
}
