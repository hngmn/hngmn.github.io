'use strict';

import classnames from 'classnames';
import * as React from 'react';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';

import { RootState, useAppDispatch } from '../../app/store';
import {
    addInstrument,
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
    const instruments: Record<string, IInstrument> = {};
    const [availableInstruments, setAvailableInstruments] = React.useState(Object.values(instruments).map(toOption));
    const sequencerInstruments: Array<IInstrument> = [];
    const [selectedInstruments, setSelectedInstruments] = React.useState(sequencerInstruments.map(toOption));

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        const hat = new TonePlayer('/assets/audio/hat.wav');

        instruments[hat.getUuid()] = hat;
        setAvailableInstruments([toOption(hat)]);
    }, []);

    return (
        <section className={classnames('instrumentSelect')}>
            <DualListBox
                options={availableInstruments}
                selected={selectedInstruments}
                onChange={(selected: Array<Option>) => setSelectedInstruments(selected)}
                preserveSelectOrder
            />

            <button onClick={() => {
                selectedInstruments.forEach(insOption => {
                    // check not in sequencer already
                    const ins = instruments[insOption.value];
                    dispatch(addInstrument(ins.getName(), ins));
                });
            }}>
                Commit to Sequencer
            </button>
        </section>
    );
}

function toOption(ins: IInstrument): Option {
    return {
        label: ins.getName(),
        value: ins.getUuid(),
    };
}
