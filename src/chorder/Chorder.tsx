'use strict';

import * as React from 'react';

import Instrument from './instrument';
import Note from './Note';
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
    const updateNotesPlaying = (notes: Array<Note>) => {
        setNotesPlaying(
            notes.sort((n1, n2) => n1.value - n2.value)
                .map(note => note.noteString())
        );
    }

    // chord degree
    useSingleKeyPress(
        Object.keys(keyMapping),
        (k: Key) => {
            ins.setDegree(keyMapping[k]);
            updateNotesPlaying(ins.update());
        },
        () => {
            return;
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
    useKeyHold('m', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.root[0] = val, updateNotesPlaying));
    useKeyHold('j', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.root[1] = val, updateNotesPlaying));
    useKeyHold('u', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.root[2] = val, updateNotesPlaying));
    useKeyHold(',', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.mid[0] = val, updateNotesPlaying));
    useKeyHold('k', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.mid[1] = val, updateNotesPlaying));
    useKeyHold('i', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.mid[2] = val, updateNotesPlaying));
    useKeyHold('.', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.high[0] = val, updateNotesPlaying));
    useKeyHold('l', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.high[1] = val, updateNotesPlaying));
    useKeyHold('o', ins.flagSettersForKeyPresses((ins, val) => ins.voicings.high[2] = val, updateNotesPlaying));

    return (
        <>
            <p>transposition: {transposition}</p>
            <p>root: {ins.getRoot().noteString()}</p>
            <p>notes playing: {notesPlaying.join(', ')}</p>

            ---<br/>

            <p>
                This is a two-handed instrument. &apos;asdfqwe&apos; keys on the left hand set the chord root to play,
                and the &apos;mju,ki.lo&apos; keys (forming a 3x3 grid on the keyboard) on the right hand control voicing.
                Right now this just plays triads.
            </p>

            Controls:
            <ul>
                <li>The 8 chord keys &apos;asdfqwe&apos; map to the 8 notes of the major scale. They can just be pressed
                    once to set the root for the instrument</li>
                <li>The three columns, &apos;mju&apos;, &apos;,ki&apos;, and &apos;.lo&apos; map to the three notes in the
                    triad (root, third, fifth, respectively). Each key in that column map to low, medium, and high octaves.
                    For example, &apos;jkl&apos; will play C4, D4, E4. Lowering the &apos;j&apos; to &apos;m&apos; will play
                    C3, D4, E4.</li>
                <li>&apos;t/g&apos; to transpose up/down</li>
            </ul>
        </>
    );
}
