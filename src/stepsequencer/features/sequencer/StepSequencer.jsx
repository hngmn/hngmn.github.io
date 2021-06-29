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
import { getAudioContext } from '../instruments/instrumentPlayer';


function StepSequencer() {
    // Custom React Hooks for Redux state (?)
    const tempo = useSelector(state => state.sequencer.tempo);
    const isPlaying = useSelector(state => state.sequencer.isPlaying);
    const instrumentNames = useSelector(selectInstrumentNames);
    const dispatch = useDispatch();

    // init audio
    useEffect(() => {
        let audioCtx = getAudioContext();

        dispatch(addInstrument('hat', new Sample(audioCtx, '/assets/audio/hat.wav')));
        dispatch(addInstrument('lazertom', new Sample(audioCtx, '/assets/audio/lazertom.wav')));
        dispatch(addInstrument('electrotom', new Sample(audioCtx, '/assets/audio/electrotom.wav')));
        dispatch(addInstrument('snare', new Sample(audioCtx, '/assets/audio/snare.wav')));
        dispatch(addInstrument('kick', new Sample(audioCtx, '/assets/audio/kick.wav')));
        dispatch(addInstrument('phone?', new Sample(audioCtx, '/assets/audio/dtmf.mp3')));
    }, []); // empty array so this hook only runs once, on mount

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
                        onClick={() => isPlaying ? dispatch(pause()) : dispatch(playThunk)}
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
