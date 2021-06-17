'use strict';

import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InstrumentControl from './InstrumentControl';
import PlayButton from './PlayButton';
import Scheduler from './Scheduler';
import Slider from './Slider';
import {
    setTempo,
    selectTempo,

    selectAudioCtx,
    selectSweep,
    selectPulse,
    selectNoise,
    selectSample,
} from './sequencerSlice';

function StepSequencer() {
    // React Hooks for React State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentNote, setCurrentNote] = useState(0);
    const [maxNotes, setMaxNotes] = useState(4);

    // Custom React Hooks for Redux state (?)
    const tempo = useSelector(selectTempo);
    const audioCtx = useSelector(selectAudioCtx);
    const sweep = useSelector(selectSweep);
    const pulse = useSelector(selectPulse);
    const noise = useSelector(selectNoise);
    const sample = useSelector(selectSample);
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

                        // play/pause the scheduler
                        //this.scheduler.playpause();
                    }}
                />
            </span>

            <InstrumentControl name={'sweep'} instrument={sweep} pads={[true]}/>

            <InstrumentControl name={'pulse'} instrument={pulse} pads={[false]}/>

            <InstrumentControl name={'noise'} instrument={noise} pads={[true]}/>

            <InstrumentControl name={'sample'} instrument={sample} pads={[false]}/>
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
