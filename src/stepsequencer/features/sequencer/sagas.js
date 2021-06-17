'use strict';

import { put, takeEvery, all } from 'redux-saga/effects';

import { printHelloAction } from './sequencerSlice';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

function* hello() {
    console.log('regular hello');
}

// 'worker' saga - does stuff
// async print for test
function* helloAsync() {
    yield delay(1500);
    yield put(printHelloAction());
}

// 'watcher' saga - applies the corresponding worker when we see the action we're interested in
function* watchHelloAsync() {
    yield takeEvery('sequencer/helloAsync', helloAsync);
}

export default function* rootSaga() {
    yield all([
        hello(),
        watchHelloAsync(),
    ])
}
