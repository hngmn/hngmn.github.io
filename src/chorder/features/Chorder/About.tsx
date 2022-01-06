'use strict';

import * as React from 'react';

export default function About(): React.ReactElement {
    return (
        <section>
            <h3>About</h3>
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
        </section>
    );
}
