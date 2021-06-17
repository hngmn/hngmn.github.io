'use strict';

import React from 'react';

export default function PlayButton(props) {
    const {
        isPlaying,
        onClick
    } = props;

    return (
        <button onClick={onClick}>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
    );
}
