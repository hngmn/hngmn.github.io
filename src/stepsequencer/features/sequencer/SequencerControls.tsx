'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import store, { useAppDispatch, RootState } from '../../app/store';
import { useKeyboardShortcut } from '../../util/useKeyboardShortcut';
import {
    // actions
    playThunk,
    pauseThunk,
    clearAllPads,
} from './sequencerSlice';

import PlayButton from './PlayButton';
import TimingControls from './TimingControls';

export default function SequencerControls() {
    // Custom React Hooks for Redux state (?)
    const isPlaying = useSelector((state: RootState) => state.sequencer.isPlaying);
    const dispatch = useAppDispatch();

    // Play/Pause functionality for 'Space' key and the Play button
    const playpause = () => isPlaying ? dispatch(pauseThunk) : dispatch(playThunk);
    useKeyboardShortcut([' '], playpause);

    return (
        <section className={'sequencerControls'}>
            <TimingControls/>

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
