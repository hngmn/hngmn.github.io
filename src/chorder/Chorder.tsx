'use strict';

import * as React from 'react';

import Instrument from './instrument';
import { useSingleKeyPress, useKeyHold, Key } from './keyboardHelpers';

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

    // transpose (scalar)
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

    // voicing
    const rootLow = useKeyHold('m', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.root[0] = val));
    const rootMid = useKeyHold('j', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.root[1] = val));
    const rootHigh = useKeyHold('u', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.root[2] = val));
    const midLow = useKeyHold(',', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.mid[0] = val));
    const midMid = useKeyHold('k', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.mid[1] = val));
    const midHigh = useKeyHold('i', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.mid[2] = val));
    const highLow = useKeyHold('.', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.high[0] = val));
    const highMid = useKeyHold('l', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.high[1] = val));
    const highHigh = useKeyHold('o', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.high[2] = val));

    return (
        <>
            <p>transposition: {transposition}</p>
            <p>degree: {keyMapping[keyPressed]}</p>
            <p>chord: {notesPlaying.join(', ')}</p>

            ---<br/>

            Other controls:
            <ul>
                <li>Hold the mju,ki.lo keys control voicing, left to right for the notes, low to high for the octave.</li>
            </ul>
        </>
    );
}
