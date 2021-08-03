'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { selectInstrumentIds } from '../instruments/instrumentsSlice';

import Track from './Track';

export default function SequencerTracks() {
    const instrumentIds = useSelector(selectInstrumentIds);

    const className = classnames('tracks');

    return (
        <section className={className}>
            {instrumentIds.map((instrumentId) => (
                <Track
                    key={instrumentId}
                    instrumentId={instrumentId}
                />
            ))}
        </section>
    );
}
