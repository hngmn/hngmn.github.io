import React from 'react'
import { render as rtlRender } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import instrumentsSlice from '../features/instruments/instrumentsSlice';
import sequencerSlice from '../features/sequencer/sequencerSlice';

function render(
    ui,
    {
        preloadedState,
        store = configureStore({
            reducer: {
                instruments: instrumentsSlice,
                sequencer: sequencerSlice,
            },
            preloadedState
        }),
        ...renderOptions
    } = {}
) {
    function Wrapper({ children }) {
        return <Provider store={store}>{children}</Provider>
    }
    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

// re-export everything
export * from '@testing-library/react'
// override render method
export { render }
