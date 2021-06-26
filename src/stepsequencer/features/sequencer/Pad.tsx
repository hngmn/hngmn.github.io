'use strict';

import React, { MouseEventHandler } from 'react';

type Props = {
    isOn: boolean,
    onClick: MouseEventHandler,
}

export default function Pad(props: Props) {
    const {
        isOn,
        onClick,
    } = props;

    const className = 'someClassName'; // TODO: this should make it so I can program styling?

    return (
        <button
            className={className}
            onClick={onClick}
        >
            <span>{isOn ? '[X]' : '[  ]'}</span>
        </button>
    );
}
