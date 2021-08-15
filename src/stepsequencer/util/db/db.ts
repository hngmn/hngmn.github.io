'use strict';

import * as idb from 'idb';
import { Ok, Err, Result } from 'ts-results';

import type { IInstrumentDBObject } from '../../features/instruments/types';

const DB = 'MyDB';
const VERSION = 1;
const STORE = 'instruments';
const INDEX_NAMES = 'instrumentNames';
const SEQUENCER_STORE = 'sequencerInstruments';
const SEQUENCER_STORE_KEY = 'sequencerInstruments';

interface Schema extends idb.DBSchema {
    [STORE]: {
        key: string
        value: IInstrumentDBObject
        indexes: {
            [INDEX_NAMES]: string
        }
    },

    [SEQUENCER_STORE]: {
        key: string
        value: Array<string>
    }
}

type StoreName = idb.StoreNames<Schema>;

let db: idb.IDBPDatabase<Schema>;

async function init() {
    const db = await idb.openDB<Schema>(DB, VERSION, {
        upgrade(db, ov, nv, tx) {
            console.log(`upgrade o:${ov} n:${nv}`);
            const store = db.createObjectStore(STORE, { keyPath: 'uuid' });

            store.createIndex(INDEX_NAMES, 'name');

            db.createObjectStore(SEQUENCER_STORE);
            tx.objectStore(SEQUENCER_STORE).put([], SEQUENCER_STORE_KEY);
        },

        blocked() {
            // TODO
            console.log('blocked');
        },

        blocking() {
            // TODO
            console.log('blocking');
        },

        terminated() {
            // TODO
            console.log('terminated');
        },
    });

    return db;
}

type DbFunctionType = (...args: any[]) => any;

// content-agnostic db access helpers
async function tryDbOp<RT>(
    op: (db: idb.IDBPDatabase<Schema>) => Promise<RT | undefined>
): Promise<Result<RT, Error>> {
    db = db ? db : await init();

    let result;
    try {
        result = await op(db);
    } catch (e) {
        return Err(e);
    }

    if (result === undefined) {
        return Err(new Error('got undefined'));
    }

    return Ok(result);
}

async function wrappedGet<SN extends StoreName>(
    store: SN,
    key: idb.StoreKey<Schema, SN>
) {
    return await tryDbOp(async (db) => {
        return await db.get(store, key);
    });
}

async function wrappedGetAll<SN extends StoreName>(
    store: SN
) {
    return await tryDbOp(async (db) => {
        return await db.getAll(store);
    });
}

async function wrappedPut<SN extends StoreName>(
    store: SN,
    item: idb.StoreValue<Schema, SN>,
    key?: idb.StoreKey<Schema, SN>
) {
    return await tryDbOp(async (db) => {
        return await db.put(store, item, key);
    });
}

async function wrappedGetAllKeysFromIndex<SN extends StoreName>(
    store: SN,
    index: idb.IndexNames<Schema, SN>
) {
    return await tryDbOp(async (db) => {
        return await db.getAllKeysFromIndex(store, index);
    });
}

async function wrappedGetAllFromIndex<SN extends StoreName>(
    store: SN,
    index: idb.IndexNames<Schema, SN>
) {
    return await tryDbOp(async (db) => {
        return await db.getAllFromIndex(store, index);
    });
}


// instrument/sequencer-specific interface

type WrappedDBResult<RT> = Promise<Result<RT, Error>>

async function getInstrument(uuid: string): WrappedDBResult<IInstrumentDBObject> {
    return (await wrappedGet(STORE, uuid));
}

async function putInstrument(ins: IInstrumentDBObject): WrappedDBResult<string> {
    return await wrappedPut(STORE, ins);
}

async function getAllInstruments(): WrappedDBResult<Array<IInstrumentDBObject>> {
    return await wrappedGetAllFromIndex(STORE, INDEX_NAMES);
}

async function getAllInstrumentIds(): WrappedDBResult<Array<string>> {
    return await wrappedGetAllKeysFromIndex(STORE, INDEX_NAMES);
}

async function getSequencerInstruments(): WrappedDBResult<Array<string>> {
    return await wrappedGet(SEQUENCER_STORE, SEQUENCER_STORE_KEY);
}

async function putSequencerInstruments(seqIns: Array<string>): WrappedDBResult<string> {
    return await wrappedPut(SEQUENCER_STORE, seqIns, SEQUENCER_STORE_KEY);
}
export default {
    getInstrument,
    putInstrument,
    getAllInstruments,
    getAllInstrumentIds,

    getSequencerInstruments,
    putSequencerInstruments,
};
