'use strict';

import * as idb from 'idb';

const DB = 'MyDB';
const VERSION = 1;
const STORE = 'instruments';

const instruments = [
    { uuid: '1', buf: new Blob(['lmao'], {type : 'text/html'}), params: ['p1', 'p2'] },
    { uuid: '2', buf: new Blob(['lol'], {type : 'text/html'}), params: ['p3', 'p4'] },
]

interface Schema extends idb.DBSchema {
    instruments: {
        key: string
        value: {
            uuid: string
            buf: Blob
            params: Array<string>
        }
    }
}

let db: idb.IDBPDatabase<Schema>;

async function init() {
    const db = await idb.openDB<Schema>(DB, VERSION, {
        upgrade(db, ov, nv) {
            console.log(`upgrade o:${ov} n:${nv}`);
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
        const i = await db.get(STORE, ins.uuid);
        if (!i) {
            await db.add(STORE, ins);
        }
    });
}

export async function print() {
    db = db ? db : await init();

    instruments.forEach(async (ins) => {
        const i = await db.get(STORE, ins.uuid);
        if (i) {
            console.log(`found ${ins.uuid}`);
            console.log(i);
        } else {
            console.log(`did not find ${ins.uuid}`);
        }
    });
}
