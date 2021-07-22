'use strict';

import React from 'react';
import {
    act,
    render,
    fireEvent,
    screen,
    waitFor,
    waitForElementToBeRemoved,
} from '../../util/test-utils';

import * as ToneMock from 'tone';

import StepSequencer from './StepSequencer';

test('Displays Loading', async () => {
    render(<StepSequencer/>);

    expect(screen.getByText(/Loading/i)).toBeTruthy();

    expect(await screen.findByRole('button', { name: /Play/i })).toBeTruthy();
    expect(screen.queryByText(/Loading/i)).toBeNull();
});

test('Initializes with instruments', async () => {
    render(<StepSequencer/>);
    await screen.findByRole('button', { name: /Play/i });

    expect(screen.getAllByRole('button', { name: /x/i })).toBeTruthy();
});

test('Play/pause button', async() => {
    render(<StepSequencer/>);
    await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Play/i })).toBeTruthy();
    });

    fireEvent.click(screen.getByRole('button', { name: /Play/i }));
    expect(screen.queryByRole('button', { name: /Pause/i })).toBeTruthy;
    expect(screen.queryByRole('button', { name: /Play/i })).toBeNull;
    // TODO expect Tone.start() to have been called (?)

    fireEvent.click(screen.getByRole('button', { name: /Pause/i }));
    expect(screen.queryByRole('button', { name: /Play/i })).toBeTruthy;
    expect(screen.queryByRole('button', { name: /Pause/i })).toBeNull;
    // TODO expect Tone.end() to have been called (?)
});

test('Play/pause key', async() => {
    render(<StepSequencer/>);
    await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Play/i })).toBeTruthy();
    });

    const space = { key: ' ', code: 'Space' };
    const seq = screen.getByRole('button', { name: /Play/i });
    fireEvent.keyDown(seq, space);
    fireEvent.keyUp(seq, space);
    expect(screen.queryByRole('button', { name: /Pause/i })).toBeTruthy;
    expect(screen.queryByRole('button', { name: /Play/i })).toBeNull;
    // TODO expect Tone.start() to have been called (?)

    fireEvent.keyDown(seq, space);
    fireEvent.keyUp(seq, space);
    expect(screen.queryByRole('button', { name: /Play/i })).toBeTruthy;
    expect(screen.queryByRole('button', { name: /Pause/i })).toBeNull;
    // TODO expect Tone.end() to have been called (?)
});

// TODO remove instrument button
