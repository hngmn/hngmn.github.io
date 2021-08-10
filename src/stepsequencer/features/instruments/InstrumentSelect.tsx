'use strict';

import classnames from 'classnames';
import * as React from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../app/store';
import {
    addInstrumentToSequencer,

    fetchLocalInstruments,
    putLocalInstrument,

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
    const availableInstruments = useSelector(selectAvailableInstruments).map(toOption);
    const sequencerInstruments = useSelector(selectSequencerInstruments).map(toOption);
    const [selectedInstruments, setSelectedInstruments] = React.useState<Array<Option>>(sequencerInstruments);

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(fetchLocalInstruments());
    }, []);

    return (
        <section className={classnames('instrumentSelect')}>
            <DualListBox
                options={availableInstruments}
                selected={selectedInstruments}
                onChange={(selected: Array<Option>) => {
                    console.log(selected);
                    setSelectedInstruments(selected);
                }}
                simpleValue={false}
                preserveSelectOrder
            />

            <button onClick={() => {
                console.log(selectedInstruments);
                selectedInstruments.forEach((insOption: Option) =>
                    dispatch(addInstrumentToSequencer(insOption.label, insOption.value)));
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
