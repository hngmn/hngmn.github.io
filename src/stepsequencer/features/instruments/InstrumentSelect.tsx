'use strict';

import classnames from 'classnames';
import * as React from 'react';

import SequencerInstrumentList from './SequencerInstrumentList';
import DbInstrumentList from './DbInstrumentList';


export default function InstrumentSelect() {
    console.debug('InstrumentSelect');

    return (
        <section className={classnames('instrumentSelect')}>
            <DbInstrumentList/>

            <SequencerInstrumentList/>
        </section>
    );
}
