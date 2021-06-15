'use strict';

import React from 'react';

export default class Pad extends React.Component {
    render() {
        const {
            isOn,
            onClick,
        } = this.props;

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
}
