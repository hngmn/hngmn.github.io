'use strict';

import {
    createSlice,
    createSelector,
    createAsyncThunk,
    PayloadAction,
} from '@reduxjs/toolkit'

import { INormalizedObject } from '../../global';
import { normalizedObjectFromTuples } from '../../util/util';
import db from '../../util/db/db';
import { AppDispatch, RootState } from '../../app/store';
import instrumentPlayer from './instrumentPlayer';
import {
    IInstrument,
    IInstrumentParameter,
    IInstrumentParameterConfig,
    IInstrumentDBObject,
    ITonePlayerDBObject,
} from './types';
import { TonePlayer } from './classes/toneInstruments';

interface IInstrumentConfig {
    id: string,
    screenName: string,
    params: INormalizedObject<IInstrumentParameterConfig>,
}

interface ISliceState {
    instruments: INormalizedObject<IInstrumentConfig>;
    availableInstruments: INormalizedObject<IInstrumentConfig>;
    dbLoaded: boolean;
}

function dboToInsConfig(dbo: IInstrumentDBObject): IInstrumentConfig {
    return {
        id: dbo.uuid,
        screenName: dbo.name,
        params: normalizedObjectFromTuples(
            dbo.parameters.map(
                (param: IInstrumentParameterConfig) => [param.name, param])),
    }
}

export const fetchLocalInstruments = createAsyncThunk('instruments/fetchLocalInstruments', async () => {
    const dbos = await db.getAllInstruments();

    // add the actual instrument to instrumentPlayer to enable playback
    const instruments = dbos.map(insDBObject => TonePlayer.from(insDBObject as ITonePlayerDBObject));
    instruments.forEach(instrumentPlayer.addInstrumentToScheduler);

    // return IInstrumentConfigs to be added to redux state
    return dbos.map(dboToInsConfig);
});

export const putLocalInstrument = createAsyncThunk('instruments/putLocalInstrument', async (ins: IInstrument) => {
    const dbo = ins.toDBObject();
    await db.putInstrument(ins.toDBObject());

    return dboToInsConfig(dbo);
});

export const instrumentsSlice = createSlice({
    name: 'instruments',

    initialState: {
        instruments: {
            byId: {},
            allIds: [],
        },

        availableInstruments: {
            byId: {},
            allIds: [],
        },

        dbLoaded: false,
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
            reducer(state, action: PayloadAction<{ instrumentId: string, parameterName: string, value: boolean | number }>) {
                const {
                    instrumentId,
                    parameterName,
                    value,
                } = action.payload;

                state.instruments.byId[instrumentId].params.byId[parameterName].value = value;
            },

            prepare(instrumentId: string, parameterName: string, value: boolean | number) {
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

    },

    extraReducers: builder => {
        builder
            .addCase(fetchLocalInstruments.fulfilled, (state, action) => {
                state.availableInstruments.allIds = action.payload.map(insConfig => insConfig.id);
                action.payload.forEach(insConfig => {
                    state.availableInstruments.byId[insConfig.id] = insConfig;
                });
            })

            .addCase(putLocalInstrument.fulfilled, (state, action) => {
                state.availableInstruments.allIds.push(action.payload.id);
                state.availableInstruments.byId[action.payload.id] = action.payload;
            })
        ;
    },
});

export function addInstrumentToSequencer(screenName: string, iid: string) {
    console.log(`addInstrumentToSequencer: sname=${screenName}, iid=${iid}`);
    const instrument = instrumentPlayer.getInstrument(iid);
    console.log(instrument);

    return function addInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        dispatch(instrumentsSlice.actions.instrumentAdded(screenName, instrument));
    };
}

export function removeInstrumentFromSequencer(id: string) {
    return function removeInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.removeInstrumentFromScheduler(id);
        return dispatch(instrumentsSlice.actions.instrumentRemoved(id));
    }
}

export function updateInstrumentParameter(instrumentId: string, parameterName: string, value: boolean | number) {
    return function updateInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        instrumentPlayer.getInstrument(instrumentId).setParameterValue(parameterName, value);
        dispatch(instrumentsSlice.actions.instrumentParameterUpdated(instrumentId, parameterName, value));
    };
}

export const playInstrument = createAsyncThunk('instruments/playInstrument', async (instrumentId: string) => {
    instrumentPlayer.playInstrument(instrumentId)
});


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

export const selectAvailableInstruments = (state: RootState): Array<[string, string]> => 
    state.instruments.availableInstruments.allIds.map(id => [
        state.instruments.availableInstruments.byId[id].id,
        state.instruments.availableInstruments.byId[id].screenName,
]);

export const selectSequencerInstruments = (state: RootState): Array<[string, string]> => 
    state.instruments.instruments.allIds.map(id => [
        state.instruments.instruments.byId[id].id,
        state.instruments.instruments.byId[id].screenName,
]);

// Actions //
export const {
    instrumentAdded,
    instrumentRemoved,
    renameInstrument,
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
