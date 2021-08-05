'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import range from '../../util/range';
import Pad from './Pad';
import {
    // selectors
    selectNBars,
    selectBeatsPerBar,
    selectPadsPerBeat,
} from './sequencerSlice';

interface Props {
    instrumentId: string,
}

export default function InstrumentPads(props: Props) {
    const {
        instrumentId,
    } = props;

    const nBars = useSelector(selectNBars);
    const beatsPerBar = useSelector(selectBeatsPerBar);
    const padsPerBeat = useSelector(selectPadsPerBeat);

    const padsClassname = classnames('track', 'pads');

    return (
        <section className={padsClassname} style={{ gridTemplateColumns: `repeat(${nBars}, 1fr)` }}>
            {range(nBars).map(bari => (
                <span key={`bar${bari}`} className={classnames('bar')} style={{ gridTemplateColumns: `repeat(${beatsPerBar}, 1fr)` }}>
                    {range(beatsPerBar).map(beati => (
                        <span key={`beat${beati}`} className={classnames('beat')} style={{ gridTemplateColumns: `repeat(${padsPerBeat}, 1fr)` }}>
                            {range(padsPerBeat).map(padi => (
                                <Pad
                                    key={`${padi}`}
                                    instrumentId={instrumentId}
                                    note={[bari, beati, padi]}
                                />
                            ))}
                        </span>
                    ))}
                </span>
            ))}
        </section>
    );
}
