'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

class BoomBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            volume: 1
        };

        const AudioContext = window.AudioContext || window.webkitAudioContext
        this.audioContext = new AudioContext();

        this.audioElement = document.querySelector('audio');
        // handle end of sound
        this.audioElement.addEventListener('ended', () => {
            this.setState({...this.state, playing: false });
        }, false);

        this.track = this.audioContext.createMediaElementSource(this.audioElement);

        // start modifying sound
        this.gainNode = this.audioContext.createGain();

        // wire audio graph
        this.track.connect(this.gainNode).connect(this.audioContext.destination);
    }

    render() {

        return (
            <div>
                <span>{`BoomBox is ${this.state.playing ? 'playing' : 'paused'}`}</span>

                <button
                    onClick={() => {

                        // check if context is in suspended state (autoplay policy)
                        if (this.audioContext.state === 'suspended') {
                            this.audioContext.resume();
                        }

                        // play or pause track depending on state
                        if (this.state.playing) {
                            this.audioElement.pause();
                        } else {
                            this.audioElement.play();
                        }

                        this.setState({...this.state, playing: !this.state.playing });
                    }}
                >
                    <span>Play/Pause</span>
                </button>

                <input
                    type={'range'}
                    id={'volume'}
                    min={0}
                    max={2}
                    value={this.state.gainValue}
                    step={0.01}
                    onInput={(event) => {
                        this.gainNode.gain.value = event.target.value;
                        this.setState({...this.state, volume: event.target.value });
                    }}
                >
                </input>

            </div>
        );
    }
}

const domContainer = document.querySelector('#boombox_container');
ReactDOM.render(<BoomBox/>, domContainer);
