'use strict';

import React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad.js';

export default function InstrumentControl(props) {
    const {
        instrument,
    } = props;

    return (
        <span>
            <InstrumentParameters params={instrument.params.allNames.map((id) => instrument.params.byName[id])}/>

            {instrument.pads.map((pad, index) => (
                <Pad key={`${name}${index}`}isOn={pad} onClick={() => {console.log(`${name} pad ${index} clicked`);}}/>
            ))}
        </span>
    );
}
