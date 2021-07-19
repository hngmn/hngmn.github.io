'use strict';

import classnames from 'classnames';
import * as React from 'react';
import InstrumentControlPanel from './InstrumentControlPanel';
import InstrumentPads from './InstrumentPads';

interface Props {
    instrumentName: string,
}

export default function Track(props: Props) {
    const {
        instrumentName,
    } = props;

    const trackClassname = classnames('track', instrumentName);

    return (
        <section className={trackClassname}>
            <InstrumentControlPanel instrumentName={instrumentName}/>

            <InstrumentPads instrumentName={instrumentName}/>
        </section>
    );
}
