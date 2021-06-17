'use strict';

import { createSlice } from '@reduxjs/toolkit'

export const sequencerSlice = createSlice({
    name: 'sequencer',
    initialState: {
        tempo: 60
    },
    reducers: {
        setTempo: (state, action) => {
            state.tempo = action.payload;
        }
    }
});

// auto generated actions
export const { setTempo } = sequencerSlice.actions;

// selectors
export const selectTempo = state => state.sequencer.tempo;

export default sequencerSlice.reducer;

