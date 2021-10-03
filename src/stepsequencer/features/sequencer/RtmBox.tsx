'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';

import { RootState, useAppDispatch } from '../../app/store';

import {
    setRtmInput,
    compileRtm,

    selectRtmState,
} from './sequencerSlice';

interface Props {
    instrumentId: string;
}

const RTM_DEBOUNCE_COMPILE_MS = 250;
const RTM_DEBOUNCE_ERROR_MS = 500;

export default function RtmBox(props: Props): React.ReactElement {
    const { instrumentId } = props;

    const {
        input,
        synced,
        valid,
        errorMessage,
    } = useSelector((state: RootState) => selectRtmState(state, instrumentId));

    const dispatch = useAppDispatch();

    const debouncedCompile = debounce(
        () => {
            dispatch(compileRtm(instrumentId));
        },
        RTM_DEBOUNCE_COMPILE_MS
    );

    return (
        <section className={classnames('rtmBox')}>
            <span>
                <label>RTM</label>
                <input
                    className={classnames('rtmInput', valid ? 'valid' : 'invalid')}
                    value={input}
                    type="text"
                    onChange={(e) => {
                        const input = e.target.value;
                        dispatch(setRtmInput(instrumentId, input));
                        debouncedCompile();
                    }}
                />

                {synced ? 'synced' : 'unsynced'}
            </span>
        </section>
    );
}
