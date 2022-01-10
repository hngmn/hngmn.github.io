'use strict';

import * as React from 'react';

import { BindingModes, useSingleKeySwitch, useSingleActiveMultiSwitch, useMultiSwitch } from '../../util/hooks';
import Slot from './Slot';


const keyStateMap = {
    '1': 'state 1',
    '2': 'state 2',
    '3': 'state 3',
};

export default function Looper(): React.ReactElement {
    const [mode, setMode] = React.useState(BindingModes.TOGGLE);
    const isOn = useSingleKeySwitch(' ', mode, false);

    const state = useSingleActiveMultiSwitch(keyStateMap, mode);

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

            <p>{state}</p>

            <span>
                <Slot n={1}/>
                <Slot n={2}/>
                <Slot n={3}/>
                <Slot n={4}/>
            </span>
        </section>
    )
}
