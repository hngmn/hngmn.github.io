'use strict';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InstrumentControl from './InstrumentControl';
import PlayButton from './PlayButton';
import Slider from './Slider';
import {
    // actions
    playThunk,
    pause,
    setTempo,
} from './sequencerSlice';
import {
    addInstrument,

    selectInstrumentNames,
} from '../instruments/instrumentsSlice';
import { Sweep, Pulse, Noise, Sample } from '../instruments/defaultInstruments';
import { FirstToneInstrument, ToneSampler } from '../instruments/toneInstruments';
import { getAudioContext } from '../instruments/instrumentPlayer';
import { useKeyboardShortcut } from '../../util/useKeyboardShortcut';


function StepSequencer() {
    // Custom React Hooks for Redux state (?)
    const tempo = useSelector(state => state.sequencer.tempo);
    const isPlaying = useSelector(state => state.sequencer.isPlaying);
    const instrumentNames = useSelector(selectInstrumentNames);
    const dispatch = useDispatch();

    // init audio
    useEffect(async () => {
        const audioCtx = await getAudioContext();

        dispatch(addInstrument('hat', new ToneSampler('/assets/audio/hat.wav')));
        dispatch(addInstrument('lazertom', new ToneSampler('/assets/audio/lazertom.wav')));
        dispatch(addInstrument('electrotom', new ToneSampler('/assets/audio/electrotom.wav')));
        dispatch(addInstrument('snare', new ToneSampler('/assets/audio/snare.wav')));
        dispatch(addInstrument('kick', new ToneSampler('/assets/audio/kick.wav')));
        dispatch(addInstrument('tonesynth', new FirstToneInstrument()));
    }, []); // empty array so this hook only runs once, on mount

    const playpause = () => isPlaying ? dispatch(pause()) : dispatch(playThunk);
    useKeyboardShortcut([' '], playpause);

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
