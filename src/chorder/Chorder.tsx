'use strict';

import * as React from 'react';

import Instrument from './instrument';
import { useSingleKeyPress, Key } from './keyboardHelpers';

const ins = new Instrument();

const keyMapping: Record<Key, number> = {
    'a': 1,
    's': 2,
    'd': 3,
    'f': 4,
    'q': 5,
    'w': 6,
    'e': 7,
};

export default function Chorder(): React.ReactElement {
    // Chorder state
    const [notesPlaying, setNotesPlaying] = React.useState<Array<string>>([]);
    const [transposition, setTransposition] = React.useState(0);

    // Set up key mappings

    // chord degree
    const keyPressed = useSingleKeyPress(
        Object.keys(keyMapping),
        (k: Key) => {
            const notes = ins.playChord(keyMapping[k]);
            setNotesPlaying(
                notes.sort((n1, n2) => n1.value - n2.value)
                    .map(note => note.noteString())
            );
        },
        () => {
            ins.stop();
            setNotesPlaying([]);
        }
    );

    // transpose
    useSingleKeyPress(
        ['t', 'g'],
        () => { return; },
        (k: Key) => {
            if (k === 't') {
                setTransposition(ins.transpose(1));
            } else if (k === 'g') {
                setTransposition(ins.transpose(-1));
            }
        }
    );

    useSingleKeyPress(
        ['y'],
        () => {
            ins.setDoubleRoot(true);
        },
        () => {
            ins.setDoubleRoot(false);
        }
    )

    return (
        <>
            <p>transposition: {transposition}</p>
            <p>degree: {keyMapping[keyPressed]}</p>
            <p>chord: {notesPlaying.join(', ')}</p>
        </>
    );
}
