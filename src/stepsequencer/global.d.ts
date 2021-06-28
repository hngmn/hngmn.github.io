'use strict';

export interface INormalizedObject<Type> {
    byId: {
        [id: string]: Type
    },
    allIds: Array<string>
}
