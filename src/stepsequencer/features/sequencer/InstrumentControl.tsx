'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import range from '../../util/range';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad';
import {
    // actions
    padClick,

    // selectors
    selectNBars,
    selectBeatsPerBar,
    selectPadsPerBeat,
} from './sequencerSlice';
import { updateInstrumentParameter, removeInstrument } from '../instruments/instrumentsSlice';

interface Props {
    instrumentName: string,
}

export default function InstrumentControl(props: Props) {
    const {
        instrumentName,
    } = props;

    const nBars = useSelector(selectNBars);
    const beatsPerBar = useSelector(selectBeatsPerBar);
    const padsPerBeat = useSelector(selectPadsPerBeat);
    const dispatch = useAppDispatch();

    const trackClassname = classnames('track', instrumentName);

    let pads = [];
    for (let bari = 0; bari < nBars; bari++) {
        for (let beati = 0; beati < beatsPerBar; beati++) {
            pads.push(
                <span key={`span${bari}${beati}`}>{beati+1}</span>
            );

            for (let padi = 0; padi < padsPerBeat; padi++) {
                pads.push(
                    <Pad
                        key={`${instrumentName}${bari}${beati}${padi}`}
                        instrumentName={instrumentName}
                        bari={bari}
                        beati={beati}
                        padi={padi}
                    />);
            }
        }
    }

    return (
        <section className={trackClassname}>
            <button onClick={(e => dispatch(removeInstrument(instrumentName)))}>
                remove
            </button>

            <span>{instrumentName}</span>

            <InstrumentParameters instrumentName={instrumentName}/>

            {pads}
        </section>
    );
}
