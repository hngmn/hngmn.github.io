'use strict';

import * as React from 'react';

import { useSingleKeySwitch } from '../../util/hooks';
import Slot from './Slot';


export default function Looper(): React.ReactElement {
    const [isOn, setOn] = React.useState(false);
    useSingleKeySwitch(' ', setOn);

    return (
        <section>
            <p>Looper</p>

            <p>{isOn ? 'on' : 'off'}</p>

            <span>
                <Slot n={1}/>
                <Slot n={2}/>
                <Slot n={3}/>
                <Slot n={4}/>
            </span>
        </section>
    )
}
