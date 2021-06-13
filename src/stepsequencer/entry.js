'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import wavetable from 'wavetable';

class StepSequencer extends React.Component {
    constructor() {
        super(props);

        // for cross browser compatibility
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        const wave = audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);
    }

    render(props) {
        return (
            <p>hello</p>
        );
    }
}
