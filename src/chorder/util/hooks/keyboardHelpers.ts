'use strict';

import { useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react';

export type Key = string;
export type KeyCallback = (k: Key) => void;
export type KeyBindings = Record<Key, { down: KeyCallback, up: KeyCallback }>;

/**
 * Most generalized key binding hook. Separate callback per key, keyevent in
 * keyBindings.
 */
function useKeyBindings(keys: Array<Key>): KeysState {
    const initialKeysState = useMemo(() => {
        console.log('initializing keysState. This should only run once.', keys);
        const kp = {} as Record<Key, boolean>;
        for (const key of keys) {
            kp[key] = false;
        }
        return {
            isPressed: kp,
            pressedOrder: [],
        };
    }, [keys]);
    const [keysState, dispatch] = useReducer(keyReducer, initialKeysState);

    useEffect(() => {
        const downHandler = ({ key }: KeyboardEvent) => {
            dispatch(KeyActions.down(key));
        };

        const upHandler = ({ key }: KeyboardEvent) => {
            dispatch(KeyActions.up(key));
        };

        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, []);

    return keysState;
}

type KeyActionType = 'down' | 'up';
const KeyActionTypes: Record<string, KeyActionType> = {
    DOWN: 'down',
    UP: 'up',
};

interface KeyAction {
    type: KeyActionType
    payload: Key
}
const KeyActions = {
    down: (key: Key) => ({ type: KeyActionTypes.DOWN, payload: key }),
    up: (key: Key) => ({ type: KeyActionTypes.UP, payload: key }),
};

interface KeysState {
    isPressed: Record<Key, boolean>
    pressedOrder: Array<Key>
    lastKeyAction?: KeyAction
}

function keyReducer(state: KeysState, action: KeyAction): KeysState {
    const key = action.payload;
    if (!(key in state.isPressed)) {
        return state;
    }

    switch(action.type) {
    case KeyActionTypes.DOWN:
        if (state.isPressed[key]) {
            if (state.pressedOrder[state.pressedOrder.length - 1] === key) {
                // early return no state change for repeating keydowns
                return state;
            }

            state.pressedOrder = state.pressedOrder.filter(k => k !== key)
        } else {
            state.isPressed[key] = true;
        }

        state.pressedOrder.push(key);
        state.lastKeyAction = action;
        return {...state};
    case KeyActionTypes.UP:
        if (state.isPressed[key]) {
            state.isPressed[key] = false;
            state.pressedOrder = state.pressedOrder.filter(k => k !== key)
            state.lastKeyAction = action;
        } else {
            console.warn(`Got keyup '${key}' but it's not marked pressed`);
        }

        return {...state};
    default:
        // shouldn't happen
        throw new Error(`Unexpected Key Action type ${action.type}`);
    }
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

    const keys = useMemo(() => [key], [key]);
    const keysState = useKeyBindings(keys);

    // update isOn
    useEffect(() => {
        if (mode === BindingModes.TOGGLE) {
            if (keysState.lastKeyAction && keysState.lastKeyAction.type === KeyActionTypes.DOWN) {
                setOn(on => !on);
            }
        } else if (mode === BindingModes.HOLD) {
            setOn(keysState.isPressed[key]);
        } else {
            throw new Error(`useSingleKeySwitch: Unexpected BindingMode ${mode}`);
        }
    }, [key, mode, keysState]);

    // callback if specified
    useEffect(() => {
        if (cb) {
            cb(isOn);
        }
    }, [cb, isOn]);

    return isOn;
}

export function useSingleActiveMultiSwitch<StateT>(
    keyMap: Record<Key, StateT>,
    mode: BindingMode,
    cb?: (s: StateT) => void
): StateT {
    const singleStateCallback = useCallback((states: Array<StateT>) => {
        if (states.length > 1) {
            throw new Error(`singleStateCallback: states array greater than 1`);
        } else if (states.length === 1 && cb) {
            cb(states[0]);
        } else {
            //console.log('singleStateCallback: states array empty');
        }
    }, [cb]);

    const activeState = useMultiSwitch(keyMap, mode, 1, singleStateCallback);

    return activeState[0];
}

/**
 * Multiswitch
* Multiple states, rather than boolean. n-active at a time.
 */
export function useMultiSwitch<StateT>(
    keyMap: Record<Key, StateT>,
    mode: BindingMode,
    n: number,
    cb?: (s: Array<StateT>) => void
): Array<StateT> {
    type KeyStatesMapQueue = {
        [Property in keyof typeof keyMap]: boolean;
    } & {
        q: Array<keyof typeof keyMap>
    };
    // a FIFO queue (with limit n) for all active states
    const [states, setStates] = useState([] as StateT[]);

    const keys = useMemo(() => Object.keys(keyMap), [keyMap]);
    const keysState = useKeyBindings(keys);

    // update states array depending on key event and binding mode
    useEffect(() => {
        if (mode === BindingModes.TOGGLE) {
            if (keysState.lastKeyAction && keysState.lastKeyAction.type === KeyActionTypes.DOWN) {
                // use a setter here so we don't have to read states. if we did
                // this effect would loop calling itself, as it depends on
                // state
                setStates(prevStates => {
                    const key = keysState.lastKeyAction!.payload;

                    if (prevStates.indexOf(keyMap[key]) >= 0) {
                        const nextStates = prevStates.filter(st => st !== keyMap[key]);
                        nextStates.push(keyMap[key]);
                        return nextStates;
                    }

                    const nextStates = [...prevStates, keyMap[key]];
                    if (nextStates.length > n) {
                        nextStates.shift();
                    }

                    return nextStates;
                });
            }

        } else if (mode === BindingModes.HOLD) {
            if (keysState.pressedOrder.length > n) {
                setStates(keysState.pressedOrder
                          .map(key => keyMap[key])
                          .slice(keysState.pressedOrder.length - n));
            } else {
                setStates(keysState.pressedOrder.map(key => keyMap[key]));
            }

        } else {
            throw new Error(`useMultiSwitch: Unexpected BindingMode ${mode}`);
        }
    }, [keyMap, mode, n, keysState]);

    // callback if specified
    useEffect(() => {
        if (cb) {
            return cb(states);
        }
    });

    return states;
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

