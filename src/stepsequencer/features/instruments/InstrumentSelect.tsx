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

    fetchLocalInstruments,
    putLocalInstrument,

    selectAvailableInstruments,
    selectSequencerInstruments,
    selectDbFetchStatus,
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
    const dbFetchStatus = useSelector(selectDbFetchStatus);
    const availableInstruments = useSelector(selectAvailableInstruments).map(toOption);
    const sequencerInstruments = useSelector(selectSequencerInstruments).map(toOption);
    const [selectedInstruments, setSelectedInstruments] = React.useState<Array<Option>>(sequencerInstruments);

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(fetchLocalInstruments());
    }, []);

    if (dbFetchStatus !== 'fulfilled') {
        return (<Loading status={dbFetchStatus}/>);
    }

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
                const sequencerInstrumentIds = sequencerInstruments.map(insOption => insOption.value);
                selectedInstruments
                    .filter((insOption: Option) => !sequencerInstrumentIds.includes(insOption.value))
                    .forEach((insOption: Option) =>
                        dispatch(addInstrumentToSequencer(insOption.value)));
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
