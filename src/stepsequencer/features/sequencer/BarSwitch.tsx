'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';
import Switch from 'react-switch';

import { useAppDispatch } from '../../app/store';
import { setNBars, selectNBars } from './sequencerSlice';

export default function BarSwitch() {
    const nBars = useSelector(selectNBars);
    const isChecked = nBars === 2; // either 1 or 2
    const dispatch = useAppDispatch();

    return (
        <label>
            <span>nBars={nBars}</span>
            <Switch
                checked={isChecked}
                onChange={(checked) => dispatch(setNBars(checked ? 2 : 1))}
            />
        </label>
    );
}
