'use strict';

import * as idb from 'idb';

const DB = 'MyDB';
const VERSION = 1;
const STORE = 'instruments';

const instruments = [
    { uuid: '1', buf: 'placeholder for arraybuf', params: ['p1', 'p2'] },
    { uuid: '2', buf: 'placeholder for arraybuf', params: ['p3', 'p4'] },
]

export async function db() {
    const db = await idb.openDB(DB, VERSION, {
        upgrade(db, oldVersion, newVersion, transaction) {
            const store = db.createObjectStore(STORE, { keyPath: 'uuid' });

            instruments.forEach(ins => db.add('STORE', ins));
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

    const ins = await db.get(STORE, '1');
    console.log(`got instrument uuid=1.`);
    console.log(ins);
}
