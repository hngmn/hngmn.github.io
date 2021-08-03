'use strict';

import classnames from 'classnames';
import * as React from 'react';
import InstrumentControlPanel from './InstrumentControlPanel';
import InstrumentPads from './InstrumentPads';

interface Props {
    instrumentId: string,
}

export default function Track(props: Props) {
    const {
        instrumentId,
    } = props;

    const trackClassname = classnames('track');

    return (
        <section className={trackClassname}>
            <InstrumentControlPanel instrumentId={instrumentId}/>

            <InstrumentPads instrumentId={instrumentId}/>
        </section>
    );
}
