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
import { TonePlayer, defaultInstruments } from './classes/toneInstruments';

interface IInstrumentConfig {
    id: string,
    screenName: string,
    params: INormalizedObject<IInstrumentParameterConfig>,
}

interface ISliceState {
    instruments: INormalizedObject<IInstrumentConfig>;
    availableInstruments: Array<string>;
    sequencerInstrumentIds: Array<string>;
    dbFetchStatus: 'notStarted' | 'pending' | 'fulfilled' | 'rejected';
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

function insToInsConfig(ins: IInstrument): IInstrumentConfig {
    return {
        id: ins.getUuid(),
        screenName: ins.getName(),
        params: normalizedObjectFromTuples(
            ins.getAllParameterNames().map(ins.getParameterConfig).map(
                (param: IInstrumentParameterConfig) => [param.name, param]))
    }
}

function loaded(id: string) {
    return instrumentPlayer.hasInstrument(id);
}

async function loadInstrument(id: string) {
    // ignore if we've loaded already
    if (loaded(id)) {
        return instrumentPlayer.getInstrument(id);
    }

    const result = await db.getInstrument(id);
    if (result.err) {
        console.error('db failed loading instrument', result.val);
        throw result.val;
    }

    const ins = await TonePlayer.from(result.unwrap() as ITonePlayerDBObject);        

    instrumentPlayer.addInstrumentToScheduler(ins);
    return ins;
}

export const fetchDbInstrumentIds = createAsyncThunk('instruments/fetchDbInstrumentIds', async () => {
    const result = await db.getAllInstrumentIds();
    if (result.err) {
        return [];
    }

    return result.unwrap();
});

export const putLocalInstrument = createAsyncThunk('instruments/putLocalInstrument', async (ins: IInstrument) => {
    // store in instrumentPlayer for playback
    instrumentPlayer.addInstrumentToScheduler(ins);

    // write to db for persistence
    const dbo = ins.toDBObject();
    await db.putInstrument(dbo);

    // return InstrumentConfig for redux state
    return dboToInsConfig(dbo);
});

export const fetchSequencerInstruments = createAsyncThunk<
    Array<string>,
    undefined,
    {
        dispatch: AppDispatch
        state: RootState
    }
>(
    'instruments/fetchSequencerInstruments',
    async (
        arg,
        {
            dispatch,
            getState,
        }
    ) => {
    const result = await db.getSequencerInstruments();
    if (result.err) {
        console.error('err getting sequencer instruments', result.val);
        throw result.val;
    }

    const sequencerInstrumentIds = result.unwrap();

    dispatch(setSequencerInstruments(sequencerInstrumentIds));

    // return ins configs for updating redux state
    return sequencerInstrumentIds;
});

export const putSequencerInstruments = createAsyncThunk(
    'instruments/putSequencerInstruments',
    async (
        ids: Array<string>
    ) => {
        db.putSequencerInstruments(ids);

        return ids.map(instrumentPlayer.getInstrument).map(insToInsConfig);
    });

export const instrumentsSlice = createSlice({
    name: 'instruments',

    initialState: {
        instruments: {
            byId: {},
            allIds: [],
        },

        availableInstruments: [],
        sequencerInstrumentIds: [],

        dbFetchStatus: 'notStarted',
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
            state.sequencerInstrumentIds.splice(state.sequencerInstrumentIds.indexOf(id), 1);
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
            .addCase(fetchDbInstrumentIds.rejected, (state, action) => {
                state.dbFetchStatus = 'rejected';
            })

            .addCase(fetchDbInstrumentIds.pending, (state, action) => {
                state.dbFetchStatus = 'pending';
            })

            .addCase(fetchDbInstrumentIds.fulfilled, (state, action) => {
                state.dbFetchStatus = 'fulfilled';
                state.availableInstruments = action.payload;
            })

            .addCase(putLocalInstrument.fulfilled, (state, action) => {
                state.availableInstruments.push(action.payload.id);
            })

            .addCase(fetchSequencerInstruments.fulfilled, (state, action) => {
                state.sequencerInstrumentIds = action.payload;
            })
    },
});

export function setSequencerInstruments(ids: Array<string>) {
    console.log('setSequencerInstruments', ids);
    return async function addInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        const currentSequencerInstrumentIds = selectSequencerInstrumentIds(getState());

        // remove instruments not in the new set
        currentSequencerInstrumentIds
            .filter(id => !ids.includes(id))
            .forEach(async id => {
                dispatch(instrumentsSlice.actions.instrumentRemoved(id));
            })

        // add new instruments
        ids
            .filter(id => !currentSequencerInstrumentIds.includes(id))
            .forEach(async id => {
                const instrument = await loadInstrument(id);
                dispatch(instrumentsSlice.actions.instrumentAdded(instrument.getName(), instrument));
            });
    };
}

export function removeInstrumentFromSequencer(id: string) {
    return function removeInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
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

export function initializeDefaultInstruments() {
    return async function initThunk(dispatch: AppDispatch, getState: () => RootState) {
        await instrumentPlayer.init();

        const result = await db.getAllInstrumentIds();
        if (result.err) {
            console.error('error getting instrumentIds from db', result.val);
            return;
        }

        const availableInstrumentIds = result.unwrap();

        if (availableInstrumentIds.length > 0) {
            console.log('found instruments in db. exiting for now');
            return;
        }

        console.log('initializing default instruments');
        const defaultIns = defaultInstruments();
        dispatch(setSequencerInstruments(defaultIns.map(id => id.getUuid())));
        defaultIns.forEach(ins => {
            dispatch(putLocalInstrument(ins));
        })

        await instrumentPlayer.getTone().loaded();
    }
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

export const selectAvailableInstruments = (state: RootState): Array<string> =>  state.instruments.availableInstruments;

export const selectSequencerInstrumentIds = (state: RootState): Array<string> =>  state.instruments.sequencerInstrumentIds;

export const selectSequencerInstruments = (state: RootState): Array<[string, string]> => 
    state.instruments.instruments.allIds.map(id => [
        state.instruments.instruments.byId[id].id,
        state.instruments.instruments.byId[id].screenName,
]);

export const selectDbFetchStatus = (state: RootState) => state.instruments.dbFetchStatus;

// Actions //
export const {
    instrumentAdded,
    instrumentRemoved,
    renameInstrument,
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
