'use strict';

import { useState, useEffect, useCallback, useMemo } from 'react';

export type Key = string;
export type KeyCallback = (k: Key) => void;
export type KeyBindings = Record<Key, { down: KeyCallback, up: KeyCallback }>;

/**
 * Most generalized key binding hook. Separate callback for every keyevent.
 */
function useKeyBindings(keys: Array<Key>, callbacks: KeyBindings): Array<Key> {
    const [keysPressed, setKeysPressed] = useState([] as Array<Key>);

    const downHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (keys.indexOf(key) >= 0) { // binding exists

                // Add to keysPressed if not pressed already - keydown repeats
                // for held keys
                if (keysPressed.indexOf(key) < 0) {
                    keysPressed.push(key);
                    setKeysPressed(keysPressed);
                    callbacks[key].down(key);
                }
            }
        },
        [keys, keysPressed, callbacks]
    );

    const upHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (keys.indexOf(key) >= 0) {
                const i = keysPressed.indexOf(key);
                if (i >= 0) {
                    // remove
                    delete keysPressed[i];
                    setKeysPressed(keysPressed);
                    callbacks[key].up(key);
                }
            }
        },
        [keys, keysPressed, callbacks]
    );

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [upHandler, downHandler]);

    return keysPressed;
}

type BindingMode = 'Toggle' | 'Hold';
export const BindingModes: Record<string, BindingMode> = {
    TOGGLE: 'Toggle',
};

export function useSingleKeySwitch(
    key: Key,
    setter: (b: boolean) => void,
    mode: BindingMode = BindingModes.TOGGLE,
    initialValue = false
): boolean {
    const [active, setActive] = useState(initialValue);
    const toggle = useCallback(
        () => {
            if (mode === BindingModes.TOGGLE) {
                setter(!active);
                setActive(!active);
            } else {
                console.error(`Unexpected BindingMode ${mode}`);
            }
        },
        [setter, mode, active]
    );

    const keysPressed = useKeyBindings(
        [key],
        {
            [key]: {
                down: toggle,
                up: () => { return; },
            },
        }
    );

    return keysPressed.length === 1;
}


export function useSingleKeyPress(keys: Array<Key>, downCallback: KeyCallback, upCallback: KeyCallback): Key {
    const keySet = useMemo(() => new Set(keys), [keys]);
    const [keyPressed, setKeyPressed] = useState('');

    const downHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (keySet.has(key) && key !== keyPressed) {
                setKeyPressed(key);
                downCallback(key);
            }
        },
        [keySet, keyPressed, downCallback]
    )

    const upHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (key === keyPressed) {
                setKeyPressed('');
                upCallback(key);
            }
        },
        [keyPressed, upCallback]
    );

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [upHandler, downHandler]); // Empty array ensures that effect is only run on mount and unmount

    return keyPressed;
}

type KeysCallback = (ki: [Key, number]) => void;

export function useSingleKeyHold(keys: Array<Key>, cb: KeysCallback): [Key, number] {
    const [keyPressed, setKeyPressed] = useState(['', -1] as [Key, number]);

    const downHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            const i = keys.indexOf(key);
            if (i >= 0 && key !== keyPressed[0]) {
                setKeyPressed([key, i]);
                cb([key, i]);
            }
        },
        [keys, keyPressed, cb]
    );

    const upHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (key === keyPressed[0]) {
                setKeyPressed(['', -1]);
                cb(['', -1]);
            }
        },
        [keys, cb]
    );

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [upHandler, downHandler]); // Empty array ensures that effect is only run on mount and unmount


    return keyPressed;
}

type SwitchCallback = (b: boolean) => void;

export function useKeyHold(targetKey: Key, cb: SwitchCallback): boolean {
    const [keyPressed, setKeyPressed] = useState(false);

    const downHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (key === targetKey && !keyPressed) {
                setKeyPressed(true);
                cb(true);
            }
        },
        [targetKey, cb, keyPressed]
    )

    const upHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (key === targetKey) {
                setKeyPressed(false);
                cb(false);
            }
        },
        [targetKey, cb]
    );

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [upHandler, downHandler]);

    return keyPressed;
}

