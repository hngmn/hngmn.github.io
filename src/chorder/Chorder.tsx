'use strict';

import * as React from 'react';

import Instrument from './instrument';
import { NoteString } from './Note';
import { useSingleKeyPress, Key } from './keyboardHelpers';

const ins = new Instrument();

const keyMapping: Record<Key, NoteString> = {
    'a': 'C4',
    's': 'D4',
    'd': 'E4',
};

export default function Chorder(): React.ReactElement {
    const keyPressed = useSingleKeyPress(
        Object.keys(keyMapping),
        (k: Key) => ins.playChord(keyMapping[k]),
        () => ins.stop()
    );

    const [playing, setPlaying] = React.useState(false);

    if (playing) {
        ins.play();
    } else {
        ins.stop();
    }

    return (
        <>
            <button
                onClick={() => setPlaying(!playing)}
            >
                {playing ? 'pause' : 'playing'}
            </button>

            <p>KeyPressed: {keyPressed}</p>
        </>
    );
}
