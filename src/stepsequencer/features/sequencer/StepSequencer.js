'use strict';

import React, { useState, useRef } from 'react';
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

    // selectors
    selectIsPlaying,
    selectTempo,
    selectAudioCtx,
    selectSweep,
    selectPulse,
    selectNoise,
    selectSample,

    instruments,
} from './sequencerSlice';

function StepSequencer() {
    // React Hooks for React State
    const [currentNote, setCurrentNote] = useState(0);
    const [maxNotes, setMaxNotes] = useState(4);

    // Custom React Hooks for Redux state (?)
    const isPlaying = useSelector(selectIsPlaying);
    const tempo = useSelector(selectTempo);
    const dispatch = useDispatch();

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

            <InstrumentControl name={'sweep'} instrument={instruments.sweep} pads={[true]}/>

            <InstrumentControl name={'pulse'} instrument={instruments.pulse} pads={[false]}/>

            <InstrumentControl name={'noise'} instrument={instruments.noise} pads={[true]}/>

            <InstrumentControl name={'sample'} instrument={instruments.sample} pads={[false]}/>
        </div>
    );

}

function schedulei(i, time) {
    if (i === 0) {
        instruments.sweep.schedule(time);
    } else if (i === 1) {
        instruments.pulse.schedule(time);
    } else if (i === 2) {
        instruments.noise.schedule(time);
    } else if (i === 3) {
        instruments.sample.schedule(time);
    }
}

function scheduleNote(beatNumber, time) {
    console.log(`scheduleNote(${beatNumber}, ${time})`);
    /*
    for (let i = 0; i < 4; i++) {
        if (pads[i][beatNumber]) {
            this.schedulei(i, time);
        }
    }
    */
}

export default StepSequencer;
