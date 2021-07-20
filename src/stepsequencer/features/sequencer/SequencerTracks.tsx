'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../app/store';
import Track from './Track';
import Loading from './Loading';
import {
    addInstrument,

    selectInstrumentNames,
} from '../instruments/instrumentsSlice';
import {
    FirstToneInstrument,
    TonePlayer,
    Conjunction,
} from '../instruments/classes/toneInstruments';
import instrumentPlayer from '../instruments/instrumentPlayer';

export default function SequencerTracks() {
    const instrumentNames = useSelector(selectInstrumentNames);

    return (
        <section className={'tracks'}>
            {instrumentNames.map((instrumentName) => (
                <Track
                    key={instrumentName}
                    instrumentName={instrumentName}
                />
            ))}
        </section>
    );
}
