'use strict';

import * as idb from 'idb';
import { Ok, Err, Result } from 'ts-results';

import type { IInstrumentDBObject } from '../../features/instruments/types';

const DB = 'MyDB';
const VERSION = 1;
const STORE = 'instruments';
const INDEX_NAMES = 'instrumentNames';

interface Schema extends idb.DBSchema {
    instruments: {
        key: string
        value: IInstrumentDBObject
        indexes: {
            [INDEX_NAMES]: string
        }
    }
}

type StoreName = idb.StoreNames<Schema>;
type KeyType = idb.StoreKey<Schema, StoreName> | IDBKeyRange
type ItemType = idb.StoreValue<Schema, StoreName>;
type IndexName = idb.IndexNames<Schema, StoreName>;

let db: idb.IDBPDatabase<Schema>;

async function init() {
    const db = await idb.openDB<Schema>(DB, VERSION, {
        upgrade(db, ov, nv) {
            console.log(`upgrade o:${ov} n:${nv}`);
            const store = db.createObjectStore(STORE, { keyPath: 'uuid' });

            store.createIndex(INDEX_NAMES, 'name');
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

async function wrappedGet(store: StoreName, key: string) {
    return await tryDbOp(async (db) => {
        return await db.get(store, key);
    });
}

async function wrappedPut(store: StoreName, item: ItemType) {
    return await tryDbOp(async (db) => {
        return await db.put(store, item);
    });
}

async function wrappedGetAllKeysFromIndex(store: StoreName, index: IndexName) {
    return await tryDbOp(async (db) => {
        return await db.getAllKeysFromIndex(store, index);
    });
}

async function wrappedGetAllFromIndex(store: StoreName, index: IndexName) {
    return await tryDbOp(async (db) => {
        return await db.getAllFromIndex(store, index);
    });
}


// instrument/sequencer-specific interface

async function getInstrument(uuid: string) {
    return await wrappedGet(STORE, uuid);
}

async function putInstrument(ins: IInstrumentDBObject) {
    return await wrappedPut(STORE, ins);
}

async function getAllInstruments() {
    return await wrappedGetAllFromIndex(STORE, INDEX_NAMES);
}

async function getAllInstrumentIds() {
    return await wrappedGetAllKeysFromIndex(STORE, INDEX_NAMES);
}

export default {
    getInstrument,
    putInstrument,
    getAllInstruments,
    getAllInstrumentIds,
};
