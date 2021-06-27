'use strict';

import * as React from 'react';

interface Props {
    isPlaying: boolean,
    onClick: React.FormEventHandler,
}

export default function PlayButton(props: Props) {
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
