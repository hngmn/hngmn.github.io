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

export const fetchDbInstrumentNames = createAsyncThunk(
    'instruments/fetchDbInstrumentNames',
    async () => {
        const result = await db.getAllInstrumentNames();
        if (result.err) {
            console.error('got error fetching db names');
            throw result.val;
        }

        console.debug('got inames from db', result.unwrap());

        return result.unwrap();
    }
);

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

        console.debug('got sequencer ins ids', sequencerInstrumentIds);

        dispatch(setSequencerInstrumentsInStore(sequencerInstrumentIds));

        // return ins configs for updating redux state
        return sequencerInstrumentIds;
    }
);

export const putLocalInstrument = createAsyncThunk<
    {
        id: string
        screenName: string
    },
    IInstrument,
    {
        dispatch: AppDispatch
    }
>(
    'instruments/putLocalInstrument',
    async (
        ins,
        { dispatch }
    ) => {
        dispatch(putInstrumentToDb(ins));
        return {
            id: ins.getUuid(),
            screenName: ins.getName(),
        }
    }
);

interface IInstrumentConfig {
    id: string,
    screenName: string,
    muted: boolean,
    solo: boolean,
    params: INormalizedObject<IInstrumentParameterConfig>,
}

interface ISliceState {
    instruments: INormalizedObject<IInstrumentConfig>;
    availableInstrumentNames: INormalizedObject<string>;
    sequencerInstrumentIds: Array<string>;
}

export const instrumentsSlice = createSlice({
    name: 'instruments',

    initialState: {
        instruments: {
            byId: {},
            allIds: [],
        },

        availableInstrumentNames: {
            byId: {},
            allIds: [],
        },

        sequencerInstrumentIds: [],
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
                    muted: false,
                    solo: false,
                    params: params,
                };
            },

            prepare(instrument: IInstrument) {
                return {
                    payload: insToInsConfig(instrument)
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

        instrumentRenamed: {
            reducer(state, action: PayloadAction<{ instrumentId: string, newScreenName: string }>) {
                const {
                    instrumentId,
                    newScreenName,
                } = action.payload;

                state.instruments.byId[instrumentId].screenName = newScreenName;
                state.availableInstrumentNames.byId[instrumentId] = newScreenName;
            },

            prepare(instrumentId: string, newScreenName: string) {
                return {
                    payload: { instrumentId, newScreenName }
                };
            }
        },

        instrumentSolo: {
            reducer(state, action: PayloadAction<{ id: string, value: boolean }>) {
                const {
                    id,
                    value,
                } = action.payload;

                state.instruments.byId[id].solo = value;
            },

            prepare(id: string, value: boolean) {
                return {
                    payload: {
                        id,
                        value,
                    }
                };
            }
        },

        instrumentMuted: {
            reducer(state, action: PayloadAction<{ id: string, value: boolean }>) {
                const {
                    id,
                    value,
                } = action.payload;

                state.instruments.byId[id].muted = value;
            },

            prepare(id: string, value: boolean) {
                return {
                    payload: {
                        id,
                        value,
                    }
                };
            }
        },

    },

    extraReducers: builder => {
        builder
            .addCase(fetchDbInstrumentNames.fulfilled, (state, action) => {
                action.payload.forEach(idname => {
                    state.availableInstrumentNames.allIds.push(idname.uuid);
                    state.availableInstrumentNames.byId[idname.uuid] = idname.name;
                });
            })

            .addCase(putLocalInstrument.fulfilled, (state, action) => {
                const {
                    id,
                    screenName,
                } = action.payload;

                state.availableInstrumentNames.allIds.push(id);
                state.availableInstrumentNames.byId[id] = screenName;
            })

            .addCase(fetchSequencerInstruments.fulfilled, (state, action) => {
                state.sequencerInstrumentIds = action.payload;
            })
    },
});

export function setSequencerInstruments(ids: Array<string>) {
    return async function setSequencerInstrumentsThunk(dispatch: AppDispatch, getState: () => RootState) {
        await dispatch(setSequencerInstrumentsInStore(ids));
        await dispatch(putSequencerInstrumentsToDb(ids));
        return;
    }
}

export function removeInstrumentFromSequencer(id: string) {
    return async function removeInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        const sequencerIds = selectSequencerInstrumentIds(getState());
        const removed = sequencerIds.splice(sequencerIds.indexOf(id), 1);
        return await dispatch(putSequencerInstrumentsToDb(removed));
        return dispatch(instrumentsSlice.actions.instrumentRemoved(id));
    }
}

export function renameInstrument(id: string, newScreenName: string) {
    return async function renameInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        const ins = instrumentPlayer.getInstrument(id);
        ins.setName(newScreenName);
        await Promise.all([
            dispatch(putInstrumentToDb(ins)),
            dispatch(instrumentsSlice.actions.instrumentRenamed(id, newScreenName)),
        ])
    }
}

export function updateInstrumentParameter(instrumentId: string, parameterName: string, value: boolean | number) {
    return async function updateInstrumentThunk(dispatch: AppDispatch, getState: () => RootState) {
        const ins = instrumentPlayer.getInstrument(instrumentId);
        ins.setParameterValue(parameterName, value);
        await dispatch(instrumentsSlice.actions.instrumentParameterUpdated(instrumentId, parameterName, value));
    };
}

export function soloInstrument(iid: string) {
    console.debug('solo ', iid);
    return async function soloThunk(dispatch: AppDispatch, getState: () => RootState) {
        const solo = !selectInsSolo(getState(), iid);
        const ins = instrumentPlayer.getInstrument(iid);
        ins.setSolo(solo);
        dispatch(instrumentsSlice.actions.instrumentSolo(iid, solo));
        ins.setMute(false);
        dispatch(instrumentsSlice.actions.instrumentMuted(iid, false));
    }
}

export function muteInstrument(iid: string) {
    console.debug('mute ', iid);
    return async function soloThunk(dispatch: AppDispatch, getState: () => RootState) {
        const muted = !selectInsMuted(getState(), iid);
        const ins = instrumentPlayer.getInstrument(iid);
        ins.setMute(muted);
        dispatch(instrumentsSlice.actions.instrumentMuted(iid, muted));
        ins.setSolo(false);
        dispatch(instrumentsSlice.actions.instrumentSolo(iid, false));
    }
}

export const playInstrument = createAsyncThunk('instruments/playInstrument', async (instrumentId: string) => {
    instrumentPlayer.playInstrument(instrumentId)
});

export function initializeDefaultInstruments() {
    return async function initThunk(dispatch: AppDispatch, getState: () => RootState) {
        console.debug('initializing default instruments');
        const defaultIns = await defaultInstruments();

        // store both instrument and the sequencer id set in db
        await Promise.all(defaultIns.map(ins => {
            dispatch(putInstrumentToDb(ins));
        }));
        const sequencerIds = defaultIns.map(id => id.getUuid());
        await dispatch(putSequencerInstrumentsToDb(sequencerIds));

        // update redux state
        await dispatch(setSequencerInstrumentsInStore(sequencerIds));

        await instrumentPlayer.getTone().loaded();
    }
}


// Helper thunks

function setSequencerInstrumentsInStore(ids: Array<string>) {
    console.debug('setSequencerInstrumentsInStore', ids);
    return async function setSequencerInstrumentsInStoreThunk(dispatch: AppDispatch, getState: () => RootState) {
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
                dispatch(instrumentsSlice.actions.instrumentAdded(instrument));
            });
    };
}

function putInstrumentToDb(ins: IInstrument) {
    console.debug('putInstrumentToDb', ins);
    return async function putInstrumentToDbThunk(dispatch: AppDispatch, getState: () => RootState) {
        // store in instrumentPlayer for playback
        instrumentPlayer.addInstrumentToScheduler(ins);

        // write to db for persistence
        const dbo = ins.toDBObject();
        return await db.putInstrument(dbo);
    }
};

function putSequencerInstrumentsToDb(ids: Array<string>) {
    console.debug('putSequencerInstrumentsToDb', ids);
    return async function putSequencerInstrumentsToDbThunk(dispatch: AppDispatch, getState: () => RootState) {
        return await db.putSequencerInstruments(ids);
    };
}


// Instrument, DB related utility/helper functions

function dboToInsConfig(dbo: IInstrumentDBObject): IInstrumentConfig {
    return {
        id: dbo.uuid,
        screenName: dbo.name,
        solo: false,
        muted: false,
        params: normalizedObjectFromTuples(
            dbo.parameters.map(
                (param: IInstrumentParameterConfig) => [param.name, param])),
    }
}

function insToInsConfig(ins: IInstrument): IInstrumentConfig {
    return {
        id: ins.getUuid(),
        screenName: ins.getName(),
        solo: false,
        muted: false,
        params: normalizedObjectFromTuples(
            ins.getAllParameterNames().map(ins.getParameterConfig.bind(ins)).map(
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

export const selectInsSolo = (state: RootState, iid: string) => state.instruments.instruments.byId[iid].solo;
export const selectInsMuted = (state: RootState, iid: string) => state.instruments.instruments.byId[iid].muted;

export const selectAvailableInstrumentNames = (state: RootState): Array<{ uuid: string, name: string }> =>
    state.instruments.availableInstrumentNames.allIds.map(id => ({
        uuid: id,
        name: state.instruments.availableInstrumentNames.byId[id],
    }));

export const selectSequencerInstrumentIds = (state: RootState): Array<string> =>  state.instruments.sequencerInstrumentIds;

export const selectSequencerInstruments = (state: RootState): Array<[string, string]> => 
    state.instruments.instruments.allIds.map(id => [
        state.instruments.instruments.byId[id].id,
        state.instruments.instruments.byId[id].screenName,
]);

// Actions //
export const {
    instrumentAdded,
    instrumentRemoved,
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
