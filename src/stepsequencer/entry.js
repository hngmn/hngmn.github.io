'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './app/store';

const domContainer = document.querySelector('#stepsequencer_container');
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  domContainer
);
