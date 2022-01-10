'use strict';

import * as React from 'react';

import { BindingModes, useSingleKeySwitch } from '../../util/hooks';
import Slot from './Slot';


export default function Looper(): React.ReactElement {
    return (
        <section>
            <p>Looper</p>

            <span>
                <Slot n={1}/>
                <Slot n={2}/>
                <Slot n={3}/>
                <Slot n={4}/>
            </span>
        </section>
    )
}
