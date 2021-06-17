'use strict';

import React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad.js';

export default function InstrumentControl(props) {
    const {
        name,
        instrument,
        pads,
    } = props;

    return (
        <span>
            <InstrumentParameters instrument={instrument}/>

            {pads.map((pad, index) => (
                <Pad key={`${name}${index}`}isOn={pad} onClick={() => {console.log(`${name} pad ${index} clicked`);}}/>
            ))}
        </span>
    );
}
