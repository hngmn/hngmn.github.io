'use strict';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InstrumentControl from './InstrumentControl';
import PlayButton from './PlayButton';
import Slider from './Slider';
import {
    // actions
    play,
    pause,
    setTempo,
    addInstrument,
    updateInstrumentParameter,

    // selectors
    selectIsPlaying,
    selectTempo,
    selectInstruments,
} from './sequencerSlice';
import { Sweep, Pulse, Noise, Sample } from '../instruments/defaultInstruments';
import { initAudio } from './sagas';


function StepSequencer() {
    // React Hooks for React State
    const [currentNote, setCurrentNote] = useState(0);

    // Custom React Hooks for Redux state (?)
    const isPlaying = useSelector(selectIsPlaying);
    const tempo = useSelector(selectTempo);
    const instruments = useSelector(selectInstruments);
    const dispatch = useDispatch();

    // init audio
    useEffect(() => {
        let audioCtx = initAudio();

        dispatch(addInstrument('sweep', new Sweep(audioCtx)));
        dispatch(addInstrument('pulse', new Pulse(audioCtx)));
        dispatch(addInstrument('noise', new Noise(audioCtx)));
        dispatch(addInstrument('sample', new Sample(audioCtx)));
    }, []); // empty array so this hook only runs once, on mount

    return (
        <div>
            <span>{`beat ${currentNote}`}</span>
            <span>{isPlaying ? 'playing' : 'paused'}</span>

            <span>
                <Slider
                    param={{name: "bpm", min: 10, max: 200, value: tempo, step: 1}}
                    onInput={(e) => dispatch(setTempo(e.target.value))}
                />

                <PlayButton
                    isPlaying={isPlaying}
                    onClick={() => isPlaying ? dispatch(pause()) : dispatch(play())}
                />
            </span>

            {instruments.map((instrument) => (
                <InstrumentControl
                    key={instrument.name}
                    instrument={instrument}
                    onInput={(instrumentName, parameterName, value) => dispatch(updateInstrumentParameter(instrumentName, parameterName, value))}
                />
            ))}
        </div>
    );

}

export default StepSequencer;
