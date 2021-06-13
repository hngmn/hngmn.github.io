'use strict';

import React from 'react';

class Slider extends React.Component {
    constructor(props) {
        super(props);
    }

    render(props) {
        const {
            name,
            value,
            onInput,
        } = this.props;

        return (
            <div>
                <label for="attack">{name}</label>
                <input name={name} id={name} type="range" min="0" max="1" value={value} step="0.1" onInput={onInput}/>
            </div>
        )
    }

    onInput(event) {
        this.setState({...this.state, value: event.target.value });
    }
}

export default Slider;
