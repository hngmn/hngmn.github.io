import { configureStore } from '@reduxjs/toolkit';

import sequencerReducer from '../features/sequencer/sequencerSlice';

export default configureStore({
    reducer: {
        sequencer: sequencerReducer
    },
});
