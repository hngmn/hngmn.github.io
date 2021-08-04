'use strict';

import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'

import { INormalizedObject } from '../../global';
import { normalizedObjectFromTuples } from '../../util/util';
import { AppDispatch, RootState } from '../../app/store';
import instrumentPlayer from './instrumentPlayer';
import { IInstrument, IInstrumentParameter, IInstrumentParameterConfig } from './types';

interface IInstrumentConfig {
    id: string,
    screenName: string,
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
            reducer(state, action: PayloadAction<{ id: string, screenName: string, params: INormalizedObject<IInstrumentParameterConfig> }>) {
                const {
                    id,
                    screenName,
                    params,
                } = action.payload;

                state.instruments.allIds.push(id);
                state.instruments.byId[id] = {
                    id: id,
                    screenName: screenName,
                    params: params,
                };

            },

            prepare(screenName: string, instrument: IInstrument) {
                return {
                    payload: {
                        id: instrument.getUuid(),
                        screenName,
                        params: normalizedObjectFromTuples(
                            instrument.getAllParameterNames().map(
                                (pName: string) => [pName, instrument.getParameterConfig(pName)]))
                    }
                };
            },
        },

        instrumentRemoved: (state, action) => {
            const id = action.payload;

            delete state.instruments.byId[id];
            state.instruments.allIds.splice(state.instruments.allIds.indexOf(id), 1);
        },

        instrumentParameterUpdated: {
            reducer(state, action: PayloadAction<{ instrumentId: string, parameterName: string, value: number }>) {
                const {
                    instrumentId,
                    parameterName,
                    value,
                } = action.payload;

                state.instruments.byId[instrumentId].params.byId[parameterName].value = value;
            },

            prepare(instrumentId: string, parameterName: string, value: number) {
                return {
                    payload: { instrumentId, parameterName, value }
                };
            }
        },

        renameInstrument: {
            reducer(state, action: PayloadAction<{ instrumentId: string, newScreenName: string }>) {
                const {
                    instrumentId,
                    newScreenName,
                } = action.payload;

                state.instruments.byId[instrumentId].screenName = newScreenName;
            },

            prepare(instrumentId: string, newScreenName: string) {
                return {
                    payload: { instrumentId, newScreenName }
                };
            }
        }

    }
});


// thunk for adding instrument to instrumentPlayer
export function addInstrument(screenName: string, instrument: IInstrument) {
    return function addInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.addInstrumentToScheduler(instrument);
        dispatch(instrumentsSlice.actions.instrumentAdded(screenName, instrument));
    };
}

export function removeInstrument(id: string) {
    return function removeInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.removeInstrumentFromScheduler(id);
        return dispatch(instrumentsSlice.actions.instrumentRemoved(id));
    }
}

export function updateInstrumentParameter(instrumentId: string, parameterName: string, value: number) {
    return function updateInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.getInstrument(instrumentId).setParameterValue(parameterName, value);
        dispatch(instrumentsSlice.actions.instrumentParameterUpdated(instrumentId, parameterName, value));
    };
}


// Selectors //

// instrument id (in order)
export const selectInstrumentIds = (state: RootState) => state.instruments.instruments.allIds;

// all instrument configs (in order)
export const selectInstrumentConfigs = createSelector(
    [
        selectInstrumentIds,
        (state) => state.instruments.instruments.byId,
    ],
    (instrumentIds, byId) => instrumentIds.map(id => byId[id])
);

// screen name for given iid
export const selectInstrumentScreenName = (state: RootState, instrumentId: string) =>
    state.instruments.instruments.byId[instrumentId].screenName;

// config for given instrument id
export const selectInstrumentConfig = (state: RootState, instrumentId: string) =>
    state.instruments.instruments.byId[instrumentId];

// parameter names (in order) for given instrument id
export const selectParameterNamesForInstrument = (state: RootState, instrumentId: string) =>
    state.instruments.instruments.byId[instrumentId].params.allIds;

// given instrument, parameter
export const selectInstrumentParameter = (state: RootState, instrumentId: string, parameterName: string) =>
    state.instruments.instruments.byId[instrumentId].params.byId[parameterName];


// Actions //
export const {
    instrumentAdded,
    instrumentRemoved,
    renameInstrument,
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
