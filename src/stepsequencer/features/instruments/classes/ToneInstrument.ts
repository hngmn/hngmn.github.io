'use strict';

import { IInstrumentParameter } from '../types';

import BaseInstrument from './BaseInstrument';

export default abstract class ToneInstrument extends BaseInstrument {
    constructor(params: Array<IInstrumentParameter>, name?: string) {
        super(params, name);
    }
}
