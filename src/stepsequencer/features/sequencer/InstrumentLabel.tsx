'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import { useKeyboardShortcut } from '../../util/useKeyboardShortcut';
import { selectInstrumentScreenName, renameInstrument } from '../instruments/instrumentsSlice';

interface Props {
    instrumentId: string,
    editable?: boolean,
}

export default function InstrumentLabel(props: Props) {
    const {
        instrumentId,
        editable = true,
    } = props;

    const [edit, setEdit] = React.useState(false);

    const screenName = useSelector((state: RootState) => selectInstrumentScreenName(state, instrumentId));
    const dispatch = useAppDispatch();

    const [screenNameEdit, setScreenNameEdit] = React.useState(screenName);
    const inputRef = React.useRef<HTMLInputElement>(null!);

    useKeyboardShortcut(['Enter'], () => {
        if (edit) {
            inputRef.current.blur();
        }
    });

    if (edit) {
        return (
            <input
                className={classnames('instrumentLabel')}
                type={'text'}
                autoFocus
                ref={inputRef}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setScreenNameEdit(e.target.value)}
                onBlur={(e) => {
                    dispatch(renameInstrument(instrumentId, screenNameEdit));
                    setEdit(false);
                }}
                value={screenNameEdit}
            />
        );
    } else {
        return (
            <span
                className={classnames('instrumentLabel')}
                onDoubleClick={() => setEdit(true)}
            >
                {screenName}
            </span>
        );
    }
}
