'use strict';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InstrumentControl from './InstrumentControl';
import { Sweep, Pulse, Noise, Sample } from './instruments';
import PlayButton from './PlayButton';
import Scheduler from './Scheduler';
import Slider from './Slider';
import {
    setTempo,
    selectTempo,
} from './sequencerSlice';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// instruments in the sequencer
const instruments = {
    sweep: new Sweep(audioCtx),
    pulse: new Pulse(audioCtx),
    noise: new Noise(audioCtx),
    sample: new Sample(audioCtx),
};

// Scheduler for precision scheduling of sounds at each beat/note
const scheduler = new Scheduler(
    () => (audioCtx.currentTime),
    () => (60),
    () => (state.maxNotes),
    scheduleNote,
    (note) => (null)
);

function StepSequencer() {
    // React Hooks for React State
    const [isPlaying, setisPlaying] = useState(false)
    const [currentNote, setCurrentNote] = useState(0);
    const [maxNotes, setMaxNotes] = useState(4);

    // Custom React Hooks for Redux state (?)
    const tempo = useSelector(selectTempo);
    const dispatch = useDispatch();

    return (
        <div>
            <span>{`beat ${currentNote}`}</span>
            <span>{isPlaying ? 'playing' : 'paused'}</span>

            <span>
                <Slider name="bpm" min={10} max={200} value={tempo} step={1} onInput={(e) => dispatch(setTempo(e.target.value))}/>

                <PlayButton
                    isPlaying={isPlaying}
                    onInput={(event) => {
                        setIsPlaying(!isPlaying);

                        // TOOD: maybe just do this if playing
                        // check if context is in suspended state (autoplay policy)
                        if (audioCtx.state === 'suspended') {
                            audioCtx.resume();
                        }

                        // play/pause the scheduler
                        //this.scheduler.playpause();
                    }}
                />
            </span>

            <InstrumentControl name={'sweep'} instrument={instruments.sweep} pads={[]}/>

            <InstrumentControl name={'pulse'} instrument={instruments.pulse} pads={[]}/>

            <InstrumentControl name={'noise'} instrument={instruments.noise} pads={[]}/>

            <InstrumentControl name={'sample'} instrument={instruments.sample} pads={[]}/>
        </div>
    );

}

function schedulei(i, time) {
    if (i === 0) {
        console.log(`scheduling sweep at time=${time}, current time is ${this.audioCtx.currentTime}`);
        sweep.schedule(time);
    } else if (i === 1) {
        pulse.schedule(time);
    } else if (i === 2) {
        noise.schedule(time);
    } else if (i === 3) {
        sample.schedule(time);
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
