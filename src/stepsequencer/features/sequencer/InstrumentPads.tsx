'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import range from '../../util/range';
import InstrumentControlPanel from './InstrumentControlPanel';
import Pad from './Pad';
import {
    // selectors
    selectNBars,
    selectBeatsPerBar,
    selectPadsPerBeat,
} from './sequencerSlice';

interface Props {
    instrumentName: string,
}

export default function InstrumentPads(props: Props) {
    const {
        instrumentName,
    } = props;

    const nBars = useSelector(selectNBars);
    const beatsPerBar = useSelector(selectBeatsPerBar);
    const padsPerBeat = useSelector(selectPadsPerBeat);

    const padsClassname = classnames('track', instrumentName, 'pads');

    return (
        <section className={padsClassname} style={{ gridTemplateColumns: `repeat(${nBars}, 1fr)` }}>
            {range(nBars).map(bari => (
                <span key={`bar${bari}`} className={classnames('bar')} style={{ gridTemplateColumns: `repeat(${beatsPerBar}, 1fr)` }}>
                    {range(beatsPerBar).map(beati => (
                        <span key={`beat${beati}`} className={classnames('beat')} style={{ gridTemplateColumns: `repeat(${padsPerBeat}, 1fr)` }}>
                            {range(padsPerBeat).map(padi => (
                                <Pad
                                    key={`${padi}`}
                                    instrumentName={instrumentName}
                                    bari={bari}
                                    beati={beati}
                                    padi={padi}
                                />
                            ))}
                        </span>
                    ))}
                </span>
            ))}
        </section>
    );
}
