'use strict';

import * as React from 'react';

import Slot from './Slot';

export default function Looper(): React.ReactElement {
    return (
        <>
            <p>Looper</p>

            <Slot n={1}/>
            <Slot n={2}/>
            <Slot n={3}/>
            <Slot n={4}/>
        </>
    )
}
