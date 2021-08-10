'use strict';

import classnames from 'classnames';
import * as React from 'react';

import InstrumentSelect from './InstrumentSelect';
import SampleUploader from './SampleUploader';

export default function InstrumentBuilder() {
    return (
        <section className={classnames()}>
            <InstrumentSelect/>

            <SampleUploader/>
        </section>
    );
}

