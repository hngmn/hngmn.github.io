'use strict';

import * as React from 'react';

import { useSingleKeySwitch, BindingModes } from '../../util/hooks';
import Slot from './Slot';


export default function Looper(): React.ReactElement {
    const [isOn, setOn] = React.useState(false);
    const [mode, setMode] = React.useState(BindingModes.TOGGLE);
    useSingleKeySwitch(' ', setOn, mode);

    return (
        <section>
            <p>Looper</p>

            <button
                onClick={() => {
                    if (mode === BindingModes.TOGGLE) {
                        setMode(BindingModes.HOLD);
                    } else {
                        setMode(BindingModes.TOGGLE);
                    }
                }}
            >
                {mode}
            </button>

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
