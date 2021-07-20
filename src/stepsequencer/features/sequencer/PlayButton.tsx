'use strict';

import classnames from 'classnames';
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

    const className = classnames('playButton');

    return (
        <button className={className} onClick={onClick}>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
    );
}
