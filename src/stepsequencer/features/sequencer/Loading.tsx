'use strict';

import * as React from 'react';

const TIMEOUT = 500; // ms

interface Props {
    status?: string
    ready: boolean
    children: React.ReactElement
}

export default function Loading(props: Props) {
    const {
        status,
        ready,
        children,
    } = props;

    // setup ... animation/timer
    const [dots, setDots] = React.useState(0);
    function incrDots() {
        setDots(dots => (dots + 1) % 3);
    }

    React.useEffect(() => {
        const timerId = window.setInterval(incrDots, TIMEOUT);
        return () => window.clearTimeout(timerId);
    }, []);

    if (ready) {
        return children;
    } else {
        return (
            <div className={'loading'}>
                <p>{`Loading${'.'.repeat(dots + 1)}`}</p>

                <p>{props.status ? `Status=${props.status}` : ''}</p>
            </div>
        )
    }
}
