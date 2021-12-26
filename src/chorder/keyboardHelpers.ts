'use strict';

import { useState, useEffect, useCallback, useMemo } from 'react';

type KeyCallback = (k: Key) => void;

export function useSingleKeyPress(keys: Array<Key>, downCallback: KeyCallback, upCallback: KeyCallback): Key {
    const keySet = useMemo(() => new Set(keys), [keys]);
    const [keyPressed, setKeyPressed] = useState('');

    const downHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (keySet.has(key) && key !== keyPressed) {
                console.log(`keydown ${key}`);
                setKeyPressed(key);
                downCallback(key);
            }
        },
        [keySet, keyPressed, downCallback]
    )

    const upHandler = useCallback(
        ({ key }: KeyboardEvent) => {
            if (key === keyPressed) {
                console.log(`keyup ${key}`);
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

export type Key = string;
