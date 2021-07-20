'use strict';

import * as React from 'react';

import { useAppDispatch } from '../../app/store';
import { addInstrument } from '../instruments/instrumentsSlice';
import {
    FirstToneInstrument,
    TonePlayer,
    Conjunction,
} from '../instruments/classes/toneInstruments';
import instrumentPlayer from '../instruments/instrumentPlayer';

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

        // initialize instrumentPlayer with instruments
        (async () => {
            await instrumentPlayer.init();

            dispatch(addInstrument('hat', new TonePlayer('/assets/audio/hat.wav')));
            dispatch(addInstrument('lazertom', new TonePlayer('/assets/audio/lazertom.wav')));
            dispatch(addInstrument('electrotom', new TonePlayer('/assets/audio/electrotom.wav')));
            dispatch(addInstrument('snare', new TonePlayer('/assets/audio/snare.wav')));
            dispatch(addInstrument('kicksynth', new Conjunction(
                new TonePlayer('/assets/audio/kick.wav'),
                new FirstToneInstrument()
            )));
            dispatch(addInstrument('kickreverse', new TonePlayer('/assets/audio/kick.wav').reverse()));

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
