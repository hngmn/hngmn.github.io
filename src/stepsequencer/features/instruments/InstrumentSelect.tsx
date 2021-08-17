'use strict';

import classnames from 'classnames';
import * as React from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../app/store';
import Loading from '../sequencer/Loading';
import {
    setSequencerInstruments,

    selectAvailableInstrumentNames,
    selectSequencerInstruments,
} from './instrumentsSlice';
import type { IInstrument } from './types';
import { TonePlayer } from './classes/toneInstruments';

interface Option {
    label: string;
    value: string;
    disabled?: boolean;
    title?: string;
}

export default function InstrumentSelect() {
    const availableInstruments = useSelector(selectAvailableInstrumentNames).map(
        ({ uuid, name }) => ({ label: name, value: uuid }));
    const sequencerInstruments = useSelector(selectSequencerInstruments).map(toOption);
    const [selectedInstruments, setSelectedInstruments] = React.useState<Array<Option>>(sequencerInstruments);

    const dispatch = useAppDispatch();

    return (
        <section className={classnames('instrumentSelect')}>
            <p className={classnames('instrumentSelectColumnTitle', 'left')}>Available Instruments</p>
            <p className={classnames('instrumentSelectColumnTitle', 'right')}>Sequencer Instruments</p>

            <DualListBox
                className={classnames('instrumentSelectInput')}
                options={availableInstruments}
                selected={selectedInstruments}
                onChange={(selected: Array<Option>) => {
                    setSelectedInstruments(selected);
                }}
                simpleValue={false}
                preserveSelectOrder
            />

            <button className={classnames('commitButton')}onClick={() => {
                const selectedInstrumentIds = selectedInstruments.map(opt => opt.value);
                dispatch(setSequencerInstruments(selectedInstrumentIds));
            }}>
                Commit changes to Sequencer
            </button>
        </section>
    );
}

// helper
function toOption(ins: [string, string]): Option {
    return {
        label: ins[1],
        value: ins[0],
    };
}
