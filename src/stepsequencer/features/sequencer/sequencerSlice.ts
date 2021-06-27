'use strict';

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AppDispatch } from '../../app/store';
import {
    getAudioContext,
    addInstrumentToScheduler,
    getInstrument,
    scheduleInstrument,
} from './instrumentPlayer.js';
import { Instrument, InstrumentConfig, InstrumentParameter } from '../instruments/types';

interface SliceState {
    nBars: number,
    notesPerBar: number,

    instruments: Map<string, InstrumentConfig>,

    isPlaying: boolean,
    tempo: number,
    timerId: number,
}

export const sequencerSlice = createSlice({
    name: 'sequencer',

    initialState: {

        // currently fixed, will be configurable state eventually
        nBars: 2,
        notesPerBar: 4,

        // sequencer instrument state
        instruments: new Map(),

        // timekeeping state
        isPlaying: false,
        tempo: 60, // bpm (beats/bars per min)
        timerId: 0,
    } as SliceState,

    reducers: {
        play: state => {
            state.isPlaying = true;
        },

        pause: state => {
            state.isPlaying = false;
        },

        setTempo: (state, action) => {
            state.tempo = action.payload;
        },

        instrumentAdded: {
            reducer(state, action: PayloadAction<{ name: string, params: Map<string, InstrumentParameter> }>) {
                const {
                    nBars,
                    notesPerBar,
                } = state;
                const totalNotes = nBars * notesPerBar;

                const {
                    name,
                    params,
                } = action.payload;

                let id = name;

                state.instruments.set(
                    id,
                    {
                        name: name,
                        pads: (new Array(totalNotes)).fill(false),
                        params: params,
                    }
                );
            },

            prepare(name: string, instrument: Instrument) {
                return {
                    payload: {
                        name: name,
                        params: instrument.params,
                    }
                };
            },
        },

        instrumentParameterUpdated: {
            reducer(state, action: PayloadAction<{ instrumentName: string, parameterName: string, value: number }>) {
                const {
                    instrumentName,
                    parameterName,
                    value,
                } = action.payload;

                let ins = state.instruments.get(instrumentName) as InstrumentConfig;
                (ins.params.get(parameterName) as InstrumentParameter).value = value;
            },

            prepare(instrumentName: string, parameterName: string, value: number) {
                return {
                    payload: { instrumentName, parameterName, value }
                };
            }
        },

        padClick: {
            reducer(state, action: PayloadAction<{ instrumentName: string, padi: number }>) {
                const {
                    instrumentName,
                    padi,
                } = action.payload;

                let ins = state.instruments.get(instrumentName) as InstrumentConfig;
                ins.pads[padi] = !ins.pads[padi];
            },

            prepare(instrumentName: string, padi: number) {
                return {
                    payload: { instrumentName, padi }
                };
            },
        },

    }
});

// thunk for adding instrument to instrumentPlayer
export function addInstrument(name: string, instrument: Instrument) {
    return function addInstrumentThunk(dispatch: AppDispatch, getState: any) {
        addInstrumentToScheduler(name, instrument);
        dispatch(sequencerSlice.actions.instrumentAdded(name, instrument));
    };
}

export function updateInstrumentParameter(instrumentName: string, parameterName: string, value: number) {
    return function updateInstrumentThunk(dispatch: AppDispatch, getState: any) {
        getInstrument(instrumentName).setParameter(parameterName, value);
        dispatch(sequencerSlice.actions.instrumentParameterUpdated(instrumentName, parameterName, value));
    };
}

// thunk for scheduling
export function playThunk(dispatch: AppDispatch, getState: any) {
    // Constants
    const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in ms)
    const SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)

    // update UI
    dispatch(sequencerSlice.actions.play());

    const audioCtx = getAudioContext();

    // check if context is in suspended state (autoplay policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    let currentNote = 0;
    let nextNoteTime = audioCtx.currentTime;
    let timerId = null;
    let lastTime = audioCtx.currentTime;

    function schedule() {
        const {
            nBars,
            notesPerBar,

            isPlaying,
            tempo,
            instruments,
        } = getState().sequencer;

        const maxNotes = nBars * notesPerBar
        if (!isPlaying) {
            // sequencer has been paused. stop scheduling
            console.log('isPlaying false. stopping schedule() timeout');
            return;
        }

        const secondsPerBeat = 60.0 / tempo;
        const intervalEnd = audioCtx.currentTime + SCHEDULEAHEADTIME;

        while (nextNoteTime < intervalEnd) {
            instruments.allIds.forEach((instrumentName: string) => {
                if (instruments.byId[instrumentName].pads[currentNote]) {
                    scheduleInstrument(instrumentName, nextNoteTime);
                }
            });

            currentNote = (currentNote + 1) % maxNotes;
            nextNoteTime += secondsPerBeat;
        }

        timerId = window.setTimeout(schedule, LOOKAHEAD);
    }

    console.log('starting schedule()');
    schedule();
}

// auto generated actions
export const {
    pause,
    setTempo,

    padClick,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
