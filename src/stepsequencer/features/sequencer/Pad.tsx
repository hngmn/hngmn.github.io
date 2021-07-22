'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import type { NoteTime } from './types';
import { useAppDispatch, RootState } from '../../app/store';
import {
    // actions
    padClick,

    // selectors
    selectPad,
    selectCurrentNote,
} from './sequencerSlice';

interface Props {
    instrumentName: string,
    note: NoteTime,
}

export default function Pad(props: Props) {
    const {
        instrumentName,
        note,
    } = props;

    const isOn = useSelector((state: RootState) => selectPad(state, instrumentName, note));
    const currentNote = useSelector(selectCurrentNote);
    const isActive =
        currentNote[0] === note[0] &&
        currentNote[1] === note[1] &&
        currentNote[2] === note[2];
    const dispatch = useAppDispatch();

    const className = classnames(
        'pad',
        isOn ? 'on' : 'off',
        isActive ? 'active': 'inactive'
    );

    return (
        <button
            className={className}
            onClick={() => dispatch(padClick(instrumentName, note))}
        />
    );
}
