'use strict';

import classnames from 'classnames';
import * as React from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../app/store';
import Loading from '../sequencer/Loading';
import {
    addInstrumentToSequencer,

    putSequencerInstruments,

    selectAvailableInstruments,
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
    const availableInstruments = useSelector(selectAvailableInstruments).map(id => ({ label: id, value: id }));
    const sequencerInstruments = useSelector(selectSequencerInstruments).map(toOption);
    const [selectedInstruments, setSelectedInstruments] = React.useState<Array<Option>>(sequencerInstruments);

    const dispatch = useAppDispatch();

    return (
        <section className={classnames('instrumentSelect')}>
            <DualListBox
                options={availableInstruments}
                selected={selectedInstruments}
                onChange={(selected: Array<Option>) => {
                    setSelectedInstruments(selected);
                }}
                simpleValue={false}
                preserveSelectOrder
            />

            <button onClick={() => {
                const sequencerInstrumentIds = sequencerInstruments.map(opt => opt.value);
                const selectedInstrumentIds = selectedInstruments.map(opt => opt.value);
                // write to db
                dispatch(putSequencerInstruments(selectedInstrumentIds));
                // add to sequencer
                selectedInstrumentIds
                    .filter(id => !sequencerInstrumentIds.includes(id))
                    .forEach(id =>
                        dispatch(addInstrumentToSequencer(id)));
            }}>
                Add to Sequencer
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
