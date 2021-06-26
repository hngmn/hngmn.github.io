'use strict';

import React from 'react';

export default function Pad(props) {
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
    )
}
