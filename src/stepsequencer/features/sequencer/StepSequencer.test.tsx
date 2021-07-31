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

test('Page initially displays Loading, then the sequencer', async () => {
    render(<StepSequencer/>);

    expect(screen.getByText(/Loading/i)).toBeTruthy();

    expect(await screen.findByRole('button', { name: /Play/i })).toBeTruthy();
    expect(screen.queryByText(/Loading/i)).toBeNull();
});

test('Sequencer successfully initializes with instruments', async () => {
    render(<StepSequencer/>);
    await screen.findByRole('button', { name: /Play/i });

    expect(screen.getAllByRole('button', { name: /x/i })).toBeTruthy();
});

test('"Play/pause" button toggles', async() => {
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

test('Space key toggles play/pause', async() => {
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

test('Pad click should toggle on/off', async() => {
    render(<StepSequencer/>);
    await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Play/i })).toBeTruthy();
    });

    const pad = await screen.getByRole('button', { name: /hat pad000/i });
    expect(pad).toHaveClass('off');
    expect(pad).not.toHaveClass('on');

    fireEvent.click(pad);
    expect(pad).toHaveClass('on');
    expect(pad).not.toHaveClass('off');

    fireEvent.click(pad);
    expect(pad).toHaveClass('off');
    expect(pad).not.toHaveClass('on');
});

test('"Clear All"" button should clear all on pads', async() => {
    render(<StepSequencer/>);
    await waitFor(() => {
        expect(screen.queryByRole('button', { name: /Play/i })).toBeTruthy();
    });

    const padsToClick = [0, 4, 8];
    const pads = await screen.getAllByRole('button', { name: /hat pad/i });
    padsToClick.forEach(padi => fireEvent.click(pads[padi]));
    padsToClick.forEach(padi => {
        expect(pads[padi]).toHaveClass('on');
    });

    fireEvent.click(screen.getByRole('button', { name: /Clear/i }));
    padsToClick.forEach(padi => {
        expect(pads[padi]).toHaveClass('off');
    });
});

// TODO remove instrument button
