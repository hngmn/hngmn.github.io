'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { selectInstrumentNames } from '../instruments/instrumentsSlice';

import Track from './Track';

export default function SequencerTracks() {
    const instrumentNames = useSelector(selectInstrumentNames);

    const className = classnames('tracks');

    return (
        <section className={className}>
            {instrumentNames.map((instrumentName) => (
                <Track
                    key={instrumentName}
                    instrumentName={instrumentName}
                />
            ))}
        </section>
    );
}
