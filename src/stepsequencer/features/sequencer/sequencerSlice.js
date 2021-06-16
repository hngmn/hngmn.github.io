'use strict';

import { createSlice } from '@reduxjs/toolkit'

export const sequencerSlice = createSlice({
    name: 'sequencer',
    initialState: {
        value: 0
    },
    reducers: {
        // TODO
    }
});

export const {} = sequencerSlice.actions;

export default sequencerSlice.reducer;
