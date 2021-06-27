'use strict';

export interface NormalizedObject<Type> {
    byId: {
        [id: string]: Type
    },
    allIds: Array<string>
}
