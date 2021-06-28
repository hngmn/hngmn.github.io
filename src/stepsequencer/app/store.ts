import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import instrumentsReducer from '../features/instruments/instrumentsSlice';
import sequencerReducer from '../features/sequencer/sequencerSlice';

const store = configureStore({
    reducer: {
        sequencer: sequencerReducer,
        instruments: instrumentsReducer,
    },
});
export default store;

// Typescript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>() // Export a hook that can be reused to resolve types
