'use strict';

import * as idb from 'idb';

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

async function getInstrument(uuid: string) {
    db = db ? db : await init();

    try {
        return await db.get(STORE, uuid);
    } catch (e) {
        console.error('db.get error:', e);
    }
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

    return await db.getAll(STORE);
}

async function getAllInstrumentIds() {
    db = db ? db : await init();

    return await db.getAllKeys(STORE);
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
