'use strict';

import * as React from 'react';

import Instrument from './instrument';
import { Switch } from './instrument';
import Note from './Note';
import { useSingleKeyPress, useKeyHold, useSingleKeyHold, Key } from './keyboardHelpers';

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

    // augdim
    useKeyHold('b', (pressed: boolean) => {
        ins.augdim.set(pressed);
        updateNotesPlaying(ins.update());
    });

    // sus
    useSingleKeyHold(
        ['c', 'v'], // sus2, sus4
        ([_, i]: [Key, number]) => {
            ins.sus.set(i+1);
            updateNotesPlaying(ins.update());
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
    const voicingSwitchCallback = (sw: Switch) => (pressed: boolean) => {
        sw.set(pressed);
        updateNotesPlaying(ins.update());
    };
    useKeyHold('m', voicingSwitchCallback(ins.voicings.root[0]));
    useKeyHold('j', voicingSwitchCallback(ins.voicings.root[1]));
    useKeyHold('u', voicingSwitchCallback(ins.voicings.root[2]));
    useKeyHold(',', voicingSwitchCallback(ins.voicings.mid[0]));
    useKeyHold('k', voicingSwitchCallback(ins.voicings.mid[1]));
    useKeyHold('i', voicingSwitchCallback(ins.voicings.mid[2]));
    useKeyHold('.', voicingSwitchCallback(ins.voicings.high[0]));
    useKeyHold('l', voicingSwitchCallback(ins.voicings.high[1]));
    useKeyHold('o', voicingSwitchCallback(ins.voicings.high[2]));

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
                <li>&apos;cv&apos; controls sus2, sus4, respectively.</li>
                <li>&apos;b&apos; controls aug/dim.</li>
                <li>The three columns, &apos;mju&apos;, &apos;,ki&apos;, and &apos;.lo&apos; map to the three notes in the
                    triad (root, third, fifth, respectively). Each key in that column map to low, medium, and high octaves.
                    For example, &apos;jkl&apos; will play C4, D4, E4. Lowering the &apos;j&apos; to &apos;m&apos; will play
                    C3, D4, E4.</li>
                <li>&apos;t/g&apos; to transpose up/down</li>
            </ul>
        </>
    );
}
