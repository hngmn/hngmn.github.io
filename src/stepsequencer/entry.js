'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
//import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';

const domContainer = document.querySelector('#stepsequencer_container');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  domContainer
);
