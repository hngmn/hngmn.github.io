'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import type { NoteTime } from './types';
import store, { useAppDispatch, RootState } from '../../app/store';
import instrumentPlayer from '../instruments/instrumentPlayer';
import {
    setTempo,
    setCurrentNote,

    selectNBars,
    selectBeatsPerBar,
    selectPadsPerBeat,
    selectInstrumentsEnabledForPad,
} from './sequencerSlice';

import BarSwitch from './BarSwitch';
import Slider from './Slider';

export default function TimingControls() {
    const nBars = useSelector(selectNBars);
    const beatsPerBar = useSelector(selectBeatsPerBar);
    const padsPerBeat = useSelector(selectPadsPerBeat);
    const tempo = useSelector((state: RootState) => state.sequencer.tempo);

    const dispatch = useAppDispatch();

    // Set up Tone.Loops for given time signature
    React.useEffect(() => {
        instrumentPlayer.setUpLoops(
            nBars,
            beatsPerBar,
            padsPerBeat,
            (note: NoteTime) => selectInstrumentsEnabledForPad(store.getState(), note),
            (note: NoteTime) => dispatch(setCurrentNote(note)));
    }, [])

    return (
        <div>
            <Slider
                {...{name: "bpm", min: 10, max: 200, value: tempo, step: 1}}
                onInput={(newTempoValue) => dispatch(setTempo(newTempoValue))}
            />

            <BarSwitch/>
        </div>
    );
}
