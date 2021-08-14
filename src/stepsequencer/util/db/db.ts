'use strict';

import * as idb from 'idb';
import { Ok, Err, Result } from 'ts-results';

import type { IInstrumentDBObject } from '../../features/instruments/types';

const DB = 'MyDB';
const VERSION = 1;
const STORE = 'instruments';
const INDEX_NAMES = 'instrumentNames';

type StoreName = typeof STORE;

interface Schema extends idb.DBSchema {
    instruments: {
        key: string
        value: IInstrumentDBObject
        indexes: {
            [INDEX_NAMES]: string
        }
    }
}

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

async function tryDbOp<RT>(op: (db: idb.IDBPDatabase<Schema>) => Promise<RT | undefined>): Promise<Result<RT, Error>> {
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

async function get(storeName: StoreName, key: string): Promise<Result<IInstrumentDBObject, Error>> {
    return await tryDbOp<IInstrumentDBObject>(async (db) => {
        return await db.get(storeName, key);
    });
}

async function getInstrument(uuid: string) {
    return await get(STORE, uuid);
}

async function putInstrument(ins: IInstrumentDBObject) {
    db = db ? db : await init();

    try {
        return await db.put(STORE, ins);
    } catch (e) {
        console.error('db.put error:', e);
    }
}

async function getAllInstruments() {
    db = db ? db : await init();

    return await db.getAllFromIndex(STORE, INDEX_NAMES);
}

async function getAllInstrumentIds() {
    db = db ? db : await init();

    return await db.getAllKeysFromIndex(STORE, INDEX_NAMES);
}

async function getAllInstrumentNames() {
    db = db ? db : await init();

    return await db.getAllKeysFromIndex(STORE, INDEX_NAMES);
}

export default {
    getInstrument,
    putInstrument,
    getAllInstruments,
    getAllInstrumentIds,
    getAllInstrumentNames,
};
