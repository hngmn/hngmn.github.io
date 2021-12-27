'use strict';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { Switch } from './instrument';

type KeyCallback = (k: Key) => void;

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

export type Key = string;
