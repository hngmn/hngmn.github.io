'use strict';

import React from 'react';
import InstrumentParameters from './InstrumentParameters';
import Pad from './Pad.js';

export default class InstrumentControl extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            name,
            instrument,
            pads,
        } = this.props;

        return (
            <span>
                <InstrumentParameters instrument={instrument}/>

                {pads.map((pad, index) => (
                    <Pad key={`${name}${index}`}isOn={pad} onClick={() => {console.log(`pad ${index} clicked`);}}/>
                ))}
            </span>

        )
    }
}
