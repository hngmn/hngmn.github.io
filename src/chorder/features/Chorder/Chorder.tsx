'use strict';

import * as React from 'react';

import { Instrument, Switch, Note } from '../../instrument';
import { useSingleKeySwitch, BindingModes, useSingleKeyPress, useKeyHold, useSingleKeyHold, Key } from '../../util/hooks';

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
            notes.sort((n1, n2) => n1.getValue() - n2.getValue())
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
    const updateAugdim = React.useCallback((pressed: boolean) => {
        ins.augdim.set(pressed);
        updateNotesPlaying(ins.update());
    }, []);
    //useSingleKeySwitch('b', BindingModes.HOLD, false, updateAugdim);

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

        </>
    );
}
