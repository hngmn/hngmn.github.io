'use strict';

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// async print for test
export function* hello(action) {
    console.log('Hello Sagas!');
}


