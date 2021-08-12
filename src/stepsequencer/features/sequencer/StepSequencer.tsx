'use strict';

import * as React from 'react';

import { useAppDispatch } from '../../app/store';
import {
    ToneSynth,
    TonePlayer,
    Conjunction,
} from '../instruments/classes/toneInstruments';
import instrumentPlayer from '../instruments/instrumentPlayer';
import { initializeDefaultInstruments } from '../instruments/instrumentsSlice';

import Loading from './Loading';
import SequencerControls from './SequencerControls';
import SequencerTracks from './SequencerTracks';

function StepSequencer() {
    // Display <Loading/> until tonejs is done loading/initializing
    const [isLoading, setLoading] = React.useState(true);

    const dispatch = useAppDispatch();

    // init audio and instruments
    React.useEffect(() => {
        let isMounted = true;

        dispatch(initializeDefaultInstruments());

        // initialize instrumentPlayer with instruments
        (async () => {
            await instrumentPlayer.getTone().loaded();

            if (isMounted) {
                setLoading(false);
            }
         })();

         return () => { isMounted = false; }
    }, []); // empty array so this hook only runs once, on mount

    if (isLoading) {
        return (<Loading/>);
    }

    return (
        <section className={'stepSequencer'}>
            <SequencerControls/>

            <SequencerTracks/>
        </section>
    );

}

export default StepSequencer;
