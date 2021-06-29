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
import { updateInstrumentParameter } from '../instruments/instrumentsSlice';

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

    return (
        <section className={trackClassname}>
            <span>{instrumentName}</span>

            <InstrumentParameters
                instrumentName={instrumentName}
            />

            {Array.from(range(0, nBars)).map(bari => (
                Array.from(range(0, beatsPerBar)).map(beati => (
                    <>
                        {beati+1}
                        {Array.from(range(0, padsPerBeat)).map(padi => (
                            <Pad
                                key={`${instrumentName}${bari}${beati}${padi}`}
                                instrumentName={instrumentName}
                                bari={bari}
                                beati={beati}
                                padi={padi}
                            />))}
                    </>
                ))))}

        </section>
    );
}
