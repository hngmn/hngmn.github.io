'use strict';

import * as React from 'react';

import { Looper } from './features/Looper';
import { Chorder, About } from './features/Chorder';

export default function App(): React.ReactElement {
    return (
        <>
            <Looper/>

            <hr/>

            <Chorder/>

            <hr/>

            <About/>
        </>
    )
}
