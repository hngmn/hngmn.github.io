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
    addInstrument,
    updateInstrumentParameter,
} from './sequencerSlice';
import { Sweep, Pulse, Noise, Sample } from '../instruments/defaultInstruments';
import { getAudioContext } from './instrumentPlayer';


function StepSequencer() {
    // Custom React Hooks for Redux state (?)
    const isPlaying = useSelector((state) => state.sequencer.isPlaying);
    const tempo = useSelector((state) => state.sequencer.tempo);
    const instrumentNames = useSelector((state) => state.sequencer.instruments.allIds);
    const dispatch = useDispatch();

    // init audio
    useEffect(() => {
        let audioCtx = getAudioContext();

        dispatch(addInstrument('sweep', new Sweep(audioCtx)));
        dispatch(addInstrument('pulse', new Pulse(audioCtx)));
        dispatch(addInstrument('noise', new Noise(audioCtx)));
        dispatch(addInstrument('sample', new Sample(audioCtx)));
    }, []); // empty array so this hook only runs once, on mount

    return (
        <div>
            <span>{isPlaying ? 'playing' : 'paused'}</span>

            <span>
                <Slider
                    param={{name: "bpm", min: 10, max: 200, value: tempo, step: 1}}
                    onInput={(e) => dispatch(setTempo(e.target.value))}
                />

                <PlayButton
                    isPlaying={isPlaying}
                    onClick={() => isPlaying ? dispatch(pause()) : dispatch(playThunk)}
                />
            </span>

            {instrumentNames.map((instrumentName) => (
                <InstrumentControl
                    key={instrumentName}
                    instrumentName={instrumentName}
                    onInput={(parameterName, value) => dispatch(updateInstrumentParameter(instrumentName, parameterName, value))}
                />
            ))}
        </div>
    );

}

export default StepSequencer;
