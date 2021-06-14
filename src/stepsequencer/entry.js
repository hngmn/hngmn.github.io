'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import StepSequencer from './StepSequencer';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const domContainer = document.querySelector('#stepsequencer_container');
ReactDOM.render(<StepSequencer audioContext={audioCtx}/>, domContainer);
