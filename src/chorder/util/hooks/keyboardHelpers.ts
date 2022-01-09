'use strict';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export type Key = string;
export type KeyCallback = (k: Key) => void;
export type KeyBindings = Record<Key, { down: KeyCallback, up: KeyCallback }>;

function useEventCallback<T, R>(fn: (arg: T) => R, deps: Array<any>): (arg: T) => R {
    const ref = useRef<typeof fn>(() => {
        throw new Error('Cannot call an event handler while rendering.');
    });

    useEffect(() => {
        ref.current = fn;
    }, [fn, ...deps]);

    return useCallback((arg: T) => {
        const fn = ref.current;
        return fn(arg);
    }, [ref]);
}

/**
 * Most generalized key binding hook. Separate callback per key, keyevent in
 * keyBindings.
 */
function useKeyBindings(keyBindings: KeyBindings): Array<Key> {
    const initialKeysPressed = useMemo(() => {
        console.log('initializing keysPressed. This should only run once.', keyBindings);
        const kp = {} as Record<Key, boolean>;
        for (const key of Object.keys(keyBindings)) {
            kp[key] = false;
        }
        return kp;
    }, [keyBindings]);
    const [keysPressed, setKeysPressed] = useState(initialKeysPressed);

    const downHandler = useEventCallback(({ key }: KeyboardEvent) => {
        if (!(key in keysPressed)) {
            return;
        }
        console.log(`keydown ${key}`);

        setKeysPressed({...keysPressed, [key]: true});
        keyBindings[key].down(key);
    }, [keyBindings, keysPressed]);

    const upHandler = useEventCallback(({ key }: KeyboardEvent) => {
        if (!(key in keysPressed)) {
            return;
        }
        console.log(`keyup ${key}`);

        setKeysPressed({...keysPressed, [key]: false});
        keyBindings[key].up(key);
    }, [keyBindings, keysPressed]);

    // I need to call the bound key callback (a side effect) at time of
    // state update. The problem is it depends on keysPressed state, but I don't
    // want to redo all the event listeners on every keypress
    // Ideally event listeners get redone as little as possible, maybe when
    // the binding mode changes but not on every keypress

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [downHandler, upHandler]);

    return Object.keys(keysPressed).filter(k => keysPressed[k]);
}


type BindingMode = 'Toggle' | 'Hold';
export const BindingModes: Record<string, BindingMode> = {
    TOGGLE: 'Toggle',
    HOLD: 'Hold',
};


/**
 * Single Key boolean switch.
 * Two modes, Toggle and Hold
 * Optional callback parameter will be called when switch state changes
 */
export function useSingleKeySwitch(
    key: Key,
    mode: BindingMode = BindingModes.TOGGLE,
    initialValue = false,
    cb?: (isOn: boolean) => void
): boolean {
    const [isOn, setOn] = useState(initialValue);

    const toggle = useCallback(
        () => {
            if (mode === BindingModes.TOGGLE) {
                setOn(isOn => !isOn);
            } else {
                console.error(`Unexpected BindingMode ${mode}`);
            }
        },
        [mode]
    );

    const switchOn = useCallback(
        () => {
            if (mode === BindingModes.HOLD) {
                setOn(true);
            } else {
                console.error(`switchOn: Unexpected BindingMode ${mode}`);
            }
        },
        [mode]
    )

    const switchOff = useCallback(
        () => {
            if (mode === BindingModes.HOLD) {
                setOn(false);
            } else {
                console.error(`switchOff: Unexpected BindingMode ${mode}`);
            }
        },
        [mode]
    )

    const kb = useMemo(() => {
        return {
            [key]: {
                down: mode === BindingModes.TOGGLE ? toggle : switchOn,
                up: mode === BindingModes.TOGGLE ? () => { return; } : switchOff,
            },
        };
    }, [key, mode, toggle, switchOn, switchOff]);

    useKeyBindings(kb);

    useEffect(() => {
        if (cb) {
            cb(isOn);
        }
    }, [cb, isOn]);

    return isOn;
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

