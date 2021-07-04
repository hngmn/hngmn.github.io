'use strict';

import { IInstrumentParameterConfig } from '../types';

import BaseInstrument from './BaseInstrument';

export default abstract class ToneInstrument extends BaseInstrument {
    constructor() {
        super([]);
    }
}
