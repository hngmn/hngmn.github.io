'use strict';

import { INormalizedObject } from '../global';

export function normalizedObjectFromTuples<Type>(tuples: Array<[string, Type]>): INormalizedObject<Type> {
    return {
        byId: Object.fromEntries(tuples),
        allIds: tuples.map((t: [string, Type]) => t[0])
    };
}

export function createEmpty3DArray<T>(isize: number, jsize: number, ksize: number, value: T): Array<Array<Array<T>>> {
    const arr: Array<Array<Array<T>>> = [];
    for (let i = 0; i < isize; i++) {
        arr.push([]);
        for (let j = 0; j < jsize; j++) {
            arr[i].push([]);
            for (let k = 0; k < ksize; k++) {
                arr[i][j].push(value);
            }
        }
    }

    return arr;
}

