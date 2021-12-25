'use strict';

import * as React from 'react';

import Instrument from './instrument';

const ins = new Instrument();

export default function Chorder(): React.ReactElement {
    const [playing, setPlaying] = React.useState(false);

    if (playing) {
        ins.play();
    } else {
        ins.stop();
    }
    return (
        <button
            onClick={() => setPlaying(!playing)}
        >
            {playing ? 'pause' : 'playing'}
        </button>
    );
}
