'use strict';

import React from 'react';

export default class PlayButton extends React.Component {
    render(props) {
        const {
            isPlaying,
            onInput
        } = this.props;

        return (
            <button onClick={onInput}>
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
        )
    }
}
