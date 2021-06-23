'use strict';

import { all } from 'redux-saga/effects';

import sequencerWatchers from '../features/sequencer/sagas';

export default function* rootSaga() {
    yield all(sequencerWatchers);
}
