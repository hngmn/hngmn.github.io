'use strict';

import * as React from 'react';

type KeyboardShortcutCallback = () => void;

/**
 * Ex:
 *     useKeyboardShortcut([' '], () => someAction());
 */
const useKeyboardShortcut = (shortcutKeys: Array<string>, callback: KeyboardShortcutCallback) => {
    const initalKeyMapping = shortcutKeys.reduce(
        (currentKeys: Record<string, boolean>, key: string) => {
            currentKeys[key] = false;
            return currentKeys;
        },
        {}
    );

    const [keys, dispatch] = React.useReducer(reducer, initalKeyMapping);

    const keydownListener = React.useCallback(
        (keydownEvent: any) => {
            const {
                key,
                target,
                repeat,
            } = keydownEvent;

            if (repeat) {
                return;
            }

            if (!shortcutKeys.includes(key)) {
                return;
            }

            if (!keys[key]) {
                dispatch(KeyboardShortcut.actions.KEYDOWN(key));
            }
        },
        [shortcutKeys, keys]
    );

    const keyupListener = React.useCallback(
        (keyupEvent: any) => {
            const {
                key,
                target,
            } = keyupEvent;

            if (!shortcutKeys.includes(key)) {
                return;
            }

            if (keys[key]) {
                dispatch(KeyboardShortcut.actions.KEYUP(key));
                callback();
            }
        },
        [shortcutKeys, keys]
    );

    React.useEffect(() => {
        window.addEventListener('keydown', keydownListener, true);
        return () => window.removeEventListener('keydown', keydownListener, true);
    }, [keydownListener]);

    React.useEffect(() => {
        window.addEventListener('keyup', keyupListener, true);
        return () => window.removeEventListener('keyup', keyupListener, true);
    }, [keyupListener]);
};

namespace KeyboardShortcut {
    export type ActionType =
        | { type: 'keyUp'; payload: string }
        | { type: 'keyDown'; payload: string }

    export const actions = {
        KEYDOWN: (key: string): ActionType => ({ type: 'keyDown', payload: key }),
        KEYUP: (key: string): ActionType => ({ type: 'keyUp', payload: key }),
    };
}

function reducer(state: Record<string, boolean>, action: KeyboardShortcut.ActionType) {
    switch (action.type) {
    case 'keyDown':
        state[action.payload] = true;
        break;
    case 'keyUp':
        state[action.payload] = false;
        break;
    default:
        // shouldn't happen
        break;
    }
    return state;
}

export default useKeyboardShortcut;
