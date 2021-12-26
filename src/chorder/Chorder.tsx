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
    const [notesPlaying, setNotesPlaying] = React.useState<Array<string>>([]);
    const keyPressed = useSingleKeyPress(
        Object.keys(keyMapping),
        (k: Key) => {
            const notes = ins.playChord(keyMapping[k]);
            setNotesPlaying(notes.map(note => note.noteString()));
        },
        () => {
            ins.stop();
            setNotesPlaying([]);
        }
    );

    return (
        <>
            <p>key: {keyMapping[keyPressed]}</p>
            <p>chord: {notesPlaying.join(', ')}</p>
        </>
    );
}
