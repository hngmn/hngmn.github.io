'use strict';

import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InstrumentControl from './InstrumentControl';
import Loading from './Loading';
import PlayButton from './PlayButton';
import Slider from './Slider';
import {
    // actions
    playThunk,
    pause,
    setTempo,
    clearAllPads,
} from './sequencerSlice';
import {
    addInstrument,

    selectInstrumentNames,
} from '../instruments/instrumentsSlice';
import { FirstToneInstrument, ToneSampler } from '../instruments/toneInstruments';
import instrumentPlayer from '../instruments/instrumentPlayer';
import { useKeyboardShortcut } from '../../util/useKeyboardShortcut';

function StepSequencer() {
    // React state for loading
    const [isLoading, setLoading] = React.useState(true);

    // Custom React Hooks for Redux state (?)
    const tempo = useSelector(state => state.sequencer.tempo);
    const isPlaying = useSelector(state => state.sequencer.isPlaying);
    const instrumentNames = useSelector(selectInstrumentNames);
    const dispatch = useDispatch();

    // init audio
    React.useEffect(async () => {
        await instrumentPlayer.init();

        dispatch(addInstrument('hat', new ToneSampler('/assets/audio/hat.wav')));
        dispatch(addInstrument('lazertom', new ToneSampler('/assets/audio/lazertom.wav')));
        dispatch(addInstrument('electrotom', new ToneSampler('/assets/audio/electrotom.wav')));
        dispatch(addInstrument('snare', new ToneSampler('/assets/audio/snare.wav')));
        dispatch(addInstrument('kick', new ToneSampler('/assets/audio/kick.wav')));
        dispatch(addInstrument('tonesynth', new FirstToneInstrument()));

        await instrumentPlayer.getTone().loaded();
        setLoading(false);
    }, []); // empty array so this hook only runs once, on mount

    const playpause = () => isPlaying ? dispatch(pause()) : dispatch(playThunk);
    useKeyboardShortcut([' '], playpause);

    if (isLoading) {
        return (<Loading/>);
    }

    return (
        <section className={'stepSequencer'}>
            <section className={'sequencerControls'}>
                <span>
                    <Slider
                        kind={'object'}
                        config={{name: "bpm", min: 10, max: 200, value: tempo, step: 1}}
                        onInput={(newTempoValue) => dispatch(setTempo(newTempoValue))}
                    />

                    <PlayButton
                        isPlaying={isPlaying}
                        onClick={playpause}
                    />

                    <button
                        onClick={() => dispatch(clearAllPads())}
                    >
                        Clear All
                    </button>
                </span>
            </section>

            <section className={'tracks'}>
                {instrumentNames.map((instrumentName) => (
                    <InstrumentControl
                        key={instrumentName}
                        instrumentName={instrumentName}
                    />
                ))}
            </section>
        </section>
    );

}

export default StepSequencer;
