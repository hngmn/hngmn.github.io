'use strict';

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { INormalizedObject } from '../../global';
import { normalizedObjectFromTuples } from '../../util/util';
import { AppDispatch, RootState } from '../../app/store';
import instrumentPlayer from './instrumentPlayer';
import { IInstrument, IInstrumentParameter, IInstrumentParameterConfig } from './types';

interface IInstrumentConfig {
    name: string,
    params: INormalizedObject<IInstrumentParameterConfig>,
}

interface ISliceState {
    instruments: INormalizedObject<IInstrumentConfig>;
}

export const instrumentsSlice = createSlice({
    name: 'instruments',

    initialState: {
        instruments: {
            byId: {},
            allIds: [],
        },
    } as ISliceState,

    reducers: {
        instrumentAdded: {
            reducer(state, action: PayloadAction<{ name: string, params: INormalizedObject<IInstrumentParameterConfig> }>) {
                const {
                    name,
                    params,
                } = action.payload;

                const id = name;

                state.instruments.allIds.push(id);
                state.instruments.byId[id] = {
                    name: id,
                    params: params,
                };

            },

            prepare(name: string, instrument: IInstrument) {
                return {
                    payload: {
                        name: name,
                        params: normalizedObjectFromTuples(instrument.getAllParameterNames().map((pName: string) => [pName, instrument.getParameterConfig(pName)]))
                    }
                };
            },
        },

        instrumentRemoved: (state, action) => {
            const name = action.payload;

            delete state.instruments.byId[name];
            state.instruments.allIds.splice(state.instruments.allIds.indexOf(name), 1);
        },

        instrumentParameterUpdated: {
            reducer(state, action: PayloadAction<{ instrumentName: string, parameterName: string, value: number }>) {
                const {
                    instrumentName,
                    parameterName,
                    value,
                } = action.payload;

                state.instruments.byId[instrumentName].params.byId[parameterName].value = value;
            },

            prepare(instrumentName: string, parameterName: string, value: number) {
                return {
                    payload: { instrumentName, parameterName, value }
                };
            }
        },

    }
});


// thunk for adding instrument to instrumentPlayer
export function addInstrument(name: string, instrument: IInstrument) {
    return function addInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.addInstrumentToScheduler(name, instrument);
        dispatch(instrumentsSlice.actions.instrumentAdded(name, instrument));
    };
}

export function removeInstrument(name: string) {
    return function removeInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.removeInstrumentFromScheduler(name);
        return dispatch(instrumentsSlice.actions.instrumentRemoved(name));
    }
}

export function updateInstrumentParameter(instrumentName: string, parameterName: string, value: number) {
    return function updateInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.getInstrument(instrumentName).setParameterValue(parameterName, value);
        dispatch(instrumentsSlice.actions.instrumentParameterUpdated(instrumentName, parameterName, value));
    };
}


// Selectors //

// instrument names (in order)
export const selectInstrumentNames = (state: RootState) => state.instruments.instruments.allIds;

// config for given instrument id
export const selectInstrumentConfig = (state: RootState, instrumentName: string) =>
    state.instruments.instruments.byId[instrumentName];

// all instrument configs (in order)
export const selectInstrumentConfigs = createSelector(
    [
        selectInstrumentNames,
        (state) => state.instruments.instruments.byId,
    ],
    (instrumentNames, byId) => instrumentNames.map(iname => byId[iname])
);

// parameter names (in order) for given instrument id
export const selectParameterNamesForInstrument = (state: RootState, instrumentName: string) =>
    state.instruments.instruments.byId[instrumentName].params.allIds;

// given instrument, parameter
export const selectInstrumentParameter = (state: RootState, instrumentName: string, parameterName: string) =>
    state.instruments.instruments.byId[instrumentName].params.byId[parameterName];


// Actions //
export const {
    instrumentAdded,
    instrumentRemoved,
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
