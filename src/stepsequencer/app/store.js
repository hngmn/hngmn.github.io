import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import sequencerReducer from '../features/sequencer/sequencerSlice';
import rootSaga from '../features/sequencer/sagas'

// async sagas for timekeeping scheduling
const sagaMiddleware = createSagaMiddleware();

export default configureStore({
    reducer: {
        sequencer: sequencerReducer
    },

    middleware: [sagaMiddleware, ...getDefaultMiddleware()]
});

sagaMiddleware.run(rootSaga);
