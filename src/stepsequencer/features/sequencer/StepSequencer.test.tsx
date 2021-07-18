'use strict';

import React from 'react';
import {
    act,
    render,
    fireEvent,
    screen,
    waitFor,
} from '../../util/test-utils';

import * as ToneMock from 'tone';

import StepSequencer from './StepSequencer';

test('Displays Loading', async () => {
    render(<StepSequencer/>);

    expect(screen.getByText(/Loading/i)).toBeTruthy();

    expect(await screen.findByRole('button', { name: /Play/i })).toBeTruthy();
    expect(screen.queryByText(/Loading/i)).toBeFalsy();
});

test('Initializes with instruments', async () => {
    render(<StepSequencer/>);
    await screen.findByRole('button', { name: /Play/i });

    expect(screen.getAllByRole('button', { name: /remove/i })).toBeTruthy();
});

test('Play/pause', async() => {
    render(<StepSequencer/>);
    expect(await screen.findByRole('button', { name: /Play/i })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Play/i }));
    expect(await screen.findByRole('button', { name: /Pause/i })).toBeTruthy();
    expect(screen.queryByText(/Play/i)).toBeFalsy();
    // TODO expect Tone.start() to have been called (?)

    fireEvent.click(screen.getByRole('button', { name: /Pause/i }));
    expect(await screen.findByRole('button', { name: /Play/i })).toBeTruthy();
    expect(screen.queryByText(/Pause/i)).toBeFalsy();
    // TODO expect Tone.stop() to have been called (?)
});

// TODO remove instrument button
