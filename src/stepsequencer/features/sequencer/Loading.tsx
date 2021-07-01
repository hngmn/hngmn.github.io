'use strict';

import * as React from 'react';

const TIMEOUT = 500; // ms

export default function Loading() {
    const [dots, setDots] = React.useState(0);

    function incrDots() {
        setDots(dots => (dots + 1) % 3);
    }

    React.useEffect(() => {
        const timerId = window.setInterval(incrDots, TIMEOUT);
        return () => window.clearTimeout(timerId);
    }, []);

    return (
        <div className={'loading'}>
            {`Loading${'.'.repeat(dots + 1)}`}
        </div>
    )
}
