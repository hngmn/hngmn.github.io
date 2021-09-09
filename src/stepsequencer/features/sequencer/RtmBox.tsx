'use strict';

import * as React from 'react';

import * as rtm from '../../util/language/rtm/rtm';

interface Props {
    instrumentId: string;
}

export default function RtmBox(props: Props) {
    const [input, setInput] = React.useState('');
    const [compiled, setCompiled] = React.useState([]);

    return (
        <section>
            <input
                type="text"
                onInput={(e) => {
                    const input = e.target.value;
                    setInput(input);
                    setCompiled(rtm.parse(input));
                }}
            />

            <p>output: {compiled.map(b => b ? 'x' : '.').join('')}</p>
        </section>
    );
}
