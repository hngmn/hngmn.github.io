'use strict';

import { Ok, Err, Result } from 'ts-results';

import * as rtm from './rtm';


export function compile(input: string, limit: number): Result<Array<boolean>, Error> {
    if (input === '') {
        return Ok(new Array(limit).fill(false));
    }

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
