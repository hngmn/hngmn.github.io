'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import store from '../../app/store';
import Track from './Track';
import Loading from './Loading';
import PlayButton from './PlayButton';
import { Slider } from './Slider';
import {
    // actions
    playThunk,
    pauseThunk,
    setTempo,
    clearAllPads,

    selectNBars,
    selectBeatsPerBar,
    selectPadsPerBeat,
    selectInstrumentsEnabledForPad,
} from './sequencerSlice';
import { useKeyboardShortcut } from '../../util/useKeyboardShortcut';
import instrumentPlayer from '../instruments/instrumentPlayer';

export default function SequencerControls() {
    // Custom React Hooks for Redux state (?)
    const nBars = useSelector(selectNBars);
    const beatsPerBar = useSelector(selectBeatsPerBar);
    const padsPerBeat = useSelector(selectPadsPerBeat);
    const tempo = useSelector((state: RootState) => state.sequencer.tempo);
    const isPlaying = useSelector((state: RootState) => state.sequencer.isPlaying);
    const dispatch = useAppDispatch();

    // Play/Pause functionality for 'Space' key and the Play button
    const playpause = () => isPlaying ? dispatch(pauseThunk) : dispatch(playThunk);
    useKeyboardShortcut([' '], playpause);

    React.useEffect(() => {
        dispatch(setTempo(99));
    }, []); // empty array so this hook only runs once, on mount

    // Set up Tone.Loops for given time signature
    React.useEffect(() => {
        instrumentPlayer.setUpLoops(
            nBars,
            beatsPerBar,
            padsPerBeat,
            (bari, beati, padi) => selectInstrumentsEnabledForPad(store.getState(), bari, beati, padi));
    }, [nBars, beatsPerBar, padsPerBeat])

    return (
        <section className={'sequencerControls'}>
            <Slider
                {...{name: "bpm", min: 10, max: 200, value: tempo, step: 1}}
                onInput={(newTempoValue) => dispatch(setTempo(newTempoValue))}
            />

            <PlayButton
                isPlaying={isPlaying}
                onClick={playpause}
            />

            <button
                className={classnames('clearAll')}
                onClick={() => dispatch(clearAllPads())}
            >
                Clear All
            </button>
        </section>
    );
}
