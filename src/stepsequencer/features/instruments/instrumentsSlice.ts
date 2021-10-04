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
    IInstrumentParameterConfig,
    IInstrumentDBObject,

    defaultInstruments,
    dboToInstrument,
} from './classes';

export const fetchDbInstrumentNames = createAsyncThunk(
    'instruments/fetchDbInstrumentNames',
    async () => {
        const result = await db.getAllInstrumentNames();
        if (result.err) {
            console.error('got error fetching db names');
            throw result.val;
        }

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
        }
    ) => {
        const result = await db.getSequencerInstruments();
        if (result.err) {
            console.error('err getting sequencer instruments', result.val);
            throw result.val;
        }

        const sequencerInstrumentIds = result.unwrap();

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
        // store in instrumentPlayer for playback
        instrumentPlayer.addInstrumentToScheduler(ins);

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
    loadedInstruments: INormalizedObject<IInstrumentConfig>;
    availableInstrumentNames: INormalizedObject<string>;
    sequencerInstrumentIds: Array<string>;
}

export const instrumentsSlice = createSlice({
    name: 'instruments',

    initialState: {
        loadedInstruments: {
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
        instrumentStaged: {
            reducer(
                state,
                action: PayloadAction<{ id: string, screenName: string, params: INormalizedObject<IInstrumentParameterConfig> }>
            ) {
                const {
                    id,
                    screenName,
                    params,
                } = action.payload;

                state.sequencerInstrumentIds.push(id);

                state.loadedInstruments.allIds.push(id);
                state.loadedInstruments.byId[id] = {
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

        instrumentUnstaged: (state, action) => {
            const id = action.payload;

            delete state.loadedInstruments.byId[id];
            state.loadedInstruments.allIds.splice(state.loadedInstruments.allIds.indexOf(id), 1);
            state.sequencerInstrumentIds.splice(state.sequencerInstrumentIds.indexOf(id), 1);
        },

        /**
         *  Delete instrument from available instruments
         *
         *  Preconditions: instrument not staged in sequencer
         */
        instrumentDeleted: (state, action) => {
            const id = action.payload;
            delete state.availableInstrumentNames.byId[id];
            state.availableInstrumentNames.allIds.splice(state.availableInstrumentNames.allIds.indexOf(id), 1);
        },

        instrumentParameterUpdated: {
            reducer(state, action: PayloadAction<{ instrumentId: string, parameterName: string, value: boolean | number }>) {
                const {
                    instrumentId,
                    parameterName,
                    value,
                } = action.payload;

                state.loadedInstruments.byId[instrumentId].params.byId[parameterName].value = value;
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

                state.loadedInstruments.byId[instrumentId].screenName = newScreenName;
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

                state.loadedInstruments.byId[id].solo = value;
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

                state.loadedInstruments.byId[id].muted = value;
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
    },
});

export function setSequencerInstruments(ids: Array<string>) {
    return async function setSequencerInstrumentsThunk(dispatch: AppDispatch): Promise<void> {
        await dispatch(setSequencerInstrumentsInStore(ids));
        await dispatch(putSequencerInstrumentsToDb(ids));
    }
}

export function removeInstrumentFromSequencer(id: string) {
    return async function removeInstrumentThunk(dispatch: AppDispatch, getState: () => RootState): Promise<void> {
        const removed = Array.from(selectSequencerInstrumentIds(getState()));
        console.debug('removeInstrumentFromSequencer: current sequencer=', removed);
        const index = removed.indexOf(id);
        if (index > -1) {
            removed.splice(index, 1);
        } else {
            console.error(`id ${id} not found in array:`, removed);
        }
        console.debug(`removeInstrumentFromSequencer: removing iid=${id}, new sequencerInstruments=`, removed)
        await dispatch(putSequencerInstrumentsToDb(removed));
        dispatch(instrumentsSlice.actions.instrumentUnstaged(id));
    }
}

export function renameInstrument(id: string, newScreenName: string) {
    return async function renameInstrumentThunk(dispatch: AppDispatch): Promise<void> {
        const ins = instrumentPlayer.getInstrument(id);
        ins.setName(newScreenName);
        await Promise.all([
            dispatch(putInstrumentToDb(ins)),
            dispatch(instrumentsSlice.actions.instrumentRenamed(id, newScreenName)),
        ])
    }
}

export function updateInstrumentParameter(instrumentId: string, parameterName: string, value: boolean | number) {
    return async function updateInstrumentThunk(dispatch: AppDispatch): Promise<void> {
        const ins = instrumentPlayer.getInstrument(instrumentId);
        ins.setParameterValue(parameterName, value);
        await dispatch(instrumentsSlice.actions.instrumentParameterUpdated(instrumentId, parameterName, value));
    };
}

export function soloInstrument(iid: string) {
    console.debug('solo ', iid);
    return async function soloThunk(dispatch: AppDispatch, getState: () => RootState): Promise<void> {
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
    return async function initThunk(dispatch: AppDispatch): Promise<void> {
        console.debug('initializing default instruments');
        const defaultIns = await defaultInstruments();
        const defaultInsIds = defaultIns.map(ins => ins.getUuid());
        await instrumentPlayer.getTone().loaded();

        defaultIns.forEach(ins => {
            dispatch(putLocalInstrument(ins));
        })
        dispatch(setSequencerInstruments(defaultInsIds));
    }
}


// Helper thunks

function setSequencerInstrumentsInStore(ids: Array<string>) {
    return async function setSequencerInstrumentsInStoreThunk(dispatch: AppDispatch, getState: () => RootState) {
        const currentSequencerInstrumentIds = selectSequencerInstrumentIds(getState());
        console.debug('setSequencerInstrumentsInStore: current=', currentSequencerInstrumentIds, 'setting to: ', ids);

        // unstage instruments not in the new set
        currentSequencerInstrumentIds
            .filter(id => !ids.includes(id))
            .forEach(async id => {
                dispatch(instrumentsSlice.actions.instrumentUnstaged(id));
            })

        // stage new instruments
        ids
            .filter(id => !currentSequencerInstrumentIds.includes(id))
            .forEach(async id => {
                const instrument = await loadInstrument(id);
                dispatch(instrumentsSlice.actions.instrumentStaged(instrument));
                console.debug(`adding iid=${id}`);
            });
    };
}

export function putInstrumentToDb(ins: IInstrument) {
    console.debug('putInstrumentToDb', ins);
    return async function putInstrumentToDbThunk() {
        // write to db for persistence
        const dbo = ins.toDBObject();
        const result = await db.putInstrument(dbo);
        if (result.err) {
            console.error('putInstrumentToDb: got error writing instrument', result.val);
            throw result.val;
        }
        return result.unwrap();
    }
}

export function deleteInstrumentFromDb(iid: string) {
    console.debug('deleteInstrumentFromDb', iid);
    return async function deleteInstrumentFromDbThunk(dispatch: AppDispatch): Promise<void> {
        const result = await db.deleteInstrument(iid);
        if (result.err) {
            console.error('deleteInstrumentDb: got error deleting instrument', result.val);
            throw result.val;
        }
        dispatch(instrumentsSlice.actions.instrumentDeleted(iid));
    }
}

function putSequencerInstrumentsToDb(ids: Array<string>) {
    console.debug('putSequencerInstrumentsToDb', ids);
    return async function putSequencerInstrumentsToDbThunk(): Promise<void> {
        const result = await db.putSequencerInstruments(ids);
        if (result.err) {
            console.error('putSequencerInstrumentsToDb: got error writing instrument', result.val);
            throw result.val;
        }
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

    const dbResult = await db.getInstrument(id);
    if (dbResult.err) {
        console.error('db failed loading instrument', dbResult.val);
        throw dbResult.val;
    }
    const dbo = dbResult.unwrap();

    const insResult = await dboToInstrument(dbo);
    if (insResult.err) {
        console.error('dboToInstrument failed', dbResult.val);
        throw dbResult.val;
    }
    const ins = insResult.unwrap();

    instrumentPlayer.addInstrumentToScheduler(ins);
    return ins;
}


// Selectors //

// instrument id (in order)
export const selectInstrumentIds = (state: RootState): Array<string> => state.instruments.loadedInstruments.allIds;

// all instrument configs (in order)
export const selectInstrumentConfigs = createSelector(
    [
        selectInstrumentIds,
        (state) => state.instruments.loadedInstruments.byId,
    ],
    (instrumentIds, byId) => instrumentIds.map(id => byId[id])
);

// screen name for given iid
export const selectInstrumentScreenName = (state: RootState, instrumentId: string): string =>
    state.instruments.loadedInstruments.byId[instrumentId].screenName;

// config for given instrument id
export const selectInstrumentConfig = (state: RootState, instrumentId: string): IInstrumentConfig =>
    state.instruments.loadedInstruments.byId[instrumentId];

// parameter names (in order) for given instrument id
export const selectParameterNamesForInstrument = (state: RootState, instrumentId: string): Array<string> =>
    state.instruments.loadedInstruments.byId[instrumentId].params.allIds;

// given instrument, parameter
export const selectInstrumentParameter = (state: RootState, instrumentId: string, parameterName: string): IInstrumentParameterConfig =>
    state.instruments.loadedInstruments.byId[instrumentId].params.byId[parameterName];

export const selectInsSolo = (state: RootState, iid: string): boolean => state.instruments.loadedInstruments.byId[iid].solo;
export const selectInsMuted = (state: RootState, iid: string): boolean => state.instruments.loadedInstruments.byId[iid].muted;

export const selectAvailableInstrumentNames = (state: RootState): Array<{ uuid: string, name: string }> =>
    state.instruments.availableInstrumentNames.allIds.map(id => ({
        uuid: id,
        name: state.instruments.availableInstrumentNames.byId[id],
    }));

export const selectSequencerInstrumentIds = (state: RootState): Array<string> =>  state.instruments.sequencerInstrumentIds;

export const selectSequencerInstruments = (state: RootState): Array<{ uuid: string, name: string }> => 
    state.instruments.sequencerInstrumentIds.map(id => ({
        uuid: state.instruments.loadedInstruments.byId[id].id,
        name: state.instruments.loadedInstruments.byId[id].screenName,
    }));

// Actions //
export const {
    instrumentStaged,
    instrumentUnstaged,
} = instrumentsSlice.actions;

export default instrumentsSlice.reducer;
