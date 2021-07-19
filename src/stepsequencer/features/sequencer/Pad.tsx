'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import {
    // actions
    padClick,

    // selectors
    selectPad,
} from './sequencerSlice';

interface Props {
    instrumentName: string,
    bari: number,
    beati: number,
    padi: number
}

export default function Pad(props: Props) {
    const {
        instrumentName,
        bari,
        beati,
        padi,
    } = props;

    const isOn = useSelector((state: RootState) => selectPad(state, instrumentName, bari, beati, padi));
    const dispatch = useAppDispatch();

    const className = classnames('pad', isOn ? 'on' : 'off', `bar${bari}`, `beat{beati}`, `pad${padi}`);

    return (
        <button
            className={className}
            onClick={() => dispatch(padClick(instrumentName, bari, beati, padi))}
        />
    );
}
