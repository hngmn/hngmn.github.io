'use strict';

import React from 'react';

export default function PlayButton(props) {
    const {
        isPlaying,
        onInput
    } = props;

    return (
        <button onClick={onInput}>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
    );
}
