'use strict';

import { INormalizedObject } from '../global';

export function normalizedObjectFromTuples<Type>(tuples: Array<[string, Type]>): INormalizedObject<Type> {
    return {
        byId: Object.fromEntries(tuples),
        allIds: tuples.map((t: [string, Type]) => t[0])
    };
}
