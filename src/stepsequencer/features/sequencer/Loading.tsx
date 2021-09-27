'use strict';

import * as React from 'react';

interface Props {
    status?: string
    ready: boolean
    children: React.ReactElement
}

export default function Loading(props: Props): React.ReactElement {
    const {
        status,
        ready,
        children,
    } = props;

    if (ready) {
        return children;
    } else {
        return (
            <div className={'loading'}>
                <p>{'Loading...'}</p>

                <p>{status ? `Status=${status}` : ''}</p>
            </div>
        )
    }
}
