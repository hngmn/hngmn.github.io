'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';
import { Ok, Err, Result } from 'ts-results';

import { useAppDispatch } from '../../app/store';
import * as rtm from '../../util/language/rtm/rtm';

import { selectNumberOfPads, setPads } from './sequencerSlice';

interface Props {
    instrumentId: string;
}

export default function RtmBox(props: Props) {
    const { instrumentId } = props;
    const nPads = useSelector(selectNumberOfPads);

    const [input, setInput] = React.useState('');
    const [compiled, setCompiled] = React.useState([]);

    const dispatch = useAppDispatch();

    return (
        <section>
            <input
                type="text"
                onChange={(e) => {
                    const input = e.target.value;
                    console.log('onChange', input);
                    setInput(input);

                    const result  = compile(input, nPads);

                    if (result.err) {

                    } else {
                        setCompiled(result.unwrap());
                        console.log('setPads', compiled);
                        dispatch(setPads(instrumentId, result.unwrap()));
                    }
                }}
            />

            <p>output: {compiled.map(b => b ? 'x' : '.').join('')}</p>
        </section>
    );
}

function compile(input: string, limit: number) {
    let output;
    try {
        output = rtm.parse(input);
    } catch (e) {
        return Err(e);
    }

    if (output.length > limit) {
        output = output.slice(0, limit);
    } else {
        output.concat(new Array(limit - output.length).fill(false));
    }

    return Ok(output);
}
