'use strict';

import { IInstrumentParameter } from '../types';

import BaseInstrument from './BaseInstrument';

export default abstract class ToneInstrument extends BaseInstrument {
    constructor(params: Array<IInstrumentParameter>) {
        super(params);
    }
}
