'use strict';

import * as idb from 'idb';

const DB = 'MyDB';
const VERSION = 1;
const STORE = 'instruments';

const instruments = [
    { uuid: '1', buf: 'placeholder for arraybuf', params: ['p1', 'p2'] },
    { uuid: '2', buf: 'placeholder for arraybuf', params: ['p3', 'p4'] },
]

interface Schema extends idb.DBSchema {
    instruments: {
        key: string
        value: {
            uuid: string
            buf: string
            params: Array<string>
        }
    }
}

let db: idb.IDBPDatabase<Schema>;

async function init() {
    const db = await idb.openDB<Schema>(DB, VERSION, {
        upgrade(db) {
            console.log('upgrade');
            db.createObjectStore(STORE, { keyPath: 'uuid' });
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

export async function addInitialItems() {
    db = db ? db : await init();

    instruments.forEach(async (ins) => {
        if (!db.get(STORE, ins.uuid)) {
            await db.add(STORE, ins);
        }
    });

    console.log(await db.get(STORE, '1'));
}
