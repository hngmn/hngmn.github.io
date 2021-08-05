'use strict';

import classnames from 'classnames';
import * as React from 'react';
import InstrumentQuickControlPanel from './InstrumentQuickControlPanel';
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
            <InstrumentQuickControlPanel instrumentId={instrumentId}/>

            <InstrumentPads instrumentId={instrumentId}/>
        </section>
    );
}
