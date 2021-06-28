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

        dispatch(addInstrument('sweep', new Sweep(audioCtx)));
        // dispatch(addInstrument('pulse', new Pulse(audioCtx)));
        // dispatch(addInstrument('noise', new Noise(audioCtx)));
        // dispatch(addInstrument('sample', new Sample(audioCtx)));
    }, []); // empty array so this hook only runs once, on mount

    return (
        <div>
            <span>{isPlaying ? 'playing' : 'paused'}</span>

            <span>
                <Slider
                    kind={'object'}
                    config={{name: "bpm", min: 10, max: 200, value: tempo, step: 1}}
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
                />
            ))}
        </div>
    );

}

export default StepSequencer;
