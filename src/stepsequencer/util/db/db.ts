'use strict';

const DB = 'MyDB';
const STORE = 'instruments';

const instruments = [
    { uuid: '1', buf: 'placeholder for arraybuf', params: ['p1', 'p2'] },
    { uuid: '2', buf: 'placeholder for arraybuf', params: ['p3', 'p4'] },
]

export function db() {
    let db: IDBDatabase, store: IDBObjectStore;
    const request = window.indexedDB.open(DB);

    request.onerror = (e) => {
        console.error('error');
    };

    request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        console.log('onupgradedneeded. Creating store');
        db = (e.target as IDBOpenDBRequest).result;
        store = db.createObjectStore(STORE, { keyPath: 'uuid' });

        store.transaction.oncomplete = (e: any) => {
            console.log('adding instruments to store');
            const istore = db.transaction(STORE, 'readwrite').objectStore(STORE);

            instruments.forEach(ins => istore.add(ins));
        };
    }

    request.onsuccess = (e: Event) => {
        console.log(e);
        db = (e.target as IDBOpenDBRequest).result;
        store = db.transaction(STORE, 'readonly').objectStore(STORE);
        const req = store.get('1');
        req.onsuccess = (e) => {
            console.log(`got instrument uuid=1.`);
            console.log(req.result);
        };
    };
}
