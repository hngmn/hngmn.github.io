'use strict';

import * as React from 'react';

interface SlotProps {
    n: number
}

export default function Slot(props: SlotProps): React.ReactElement {
    const {
        n
    } = props;

    return (
        <button
         onClick={() => console.log('click ', n)}
        >
            Slot
        </button>
    )
}
