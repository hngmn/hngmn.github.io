'use strict';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InstrumentControl from './InstrumentControl';
import PlayButton from './PlayButton';
import Scheduler from './Scheduler';
import Slider from './Slider';
import {
    // actions
    play,
    pause,
    setTempo,
    addInstrument,

    // selectors
    selectIsPlaying,
    selectTempo,
    selectInstruments,
} from './sequencerSlice';
import { Sweep, Pulse, Noise, Sample } from './instruments';
import { initAudio } from './sagas';


function StepSequencer() {
    // React Hooks for React State
    const [currentNote, setCurrentNote] = useState(0);
    const [maxNotes, setMaxNotes] = useState(4);

    // Custom React Hooks for Redux state (?)
    const isPlaying = useSelector(selectIsPlaying);
    const tempo = useSelector(selectTempo);
    const instruments = useSelector(selectInstruments);
    const dispatch = useDispatch();

    // init audio
    useEffect(() => {
        let audioCtx = initAudio();

        let sweep = new Sweep(audioCtx);
        dispatch(addInstrument({
            name: 'Sweep',
            params: sweep.params,
        }));

        let pulse = new Pulse(audioCtx);
        dispatch(addInstrument({
            name: 'Pulse',
            params: pulse.params,
        }));
    }, []); // empty array so this hook only runs once, on mount

    return (
        <div>
            <span>{`beat ${currentNote}`}</span>
            <span>{isPlaying ? 'playing' : 'paused'}</span>

            <span>
                <Slider param={{name: "bpm", min: 10, max: 200, value: tempo, step: 1, onInput: (e) => dispatch(setTempo(e.target.value))}}/>

                <PlayButton
                    isPlaying={isPlaying}
                    onClick={() => isPlaying ? dispatch(pause()) : dispatch(play())}
                />
            </span>

            {instruments.map((instrument) => (
                <InstrumentControl key={instrument.name} instrument={instrument} />
            ))}
        </div>
    );

}

export default StepSequencer;
