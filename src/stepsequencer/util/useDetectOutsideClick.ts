'use strict';

import * as React from 'react';

export default function useDetectOutsideClick(ref: React.RefObject<HTMLElement>, callback: (e: MouseEvent) => void) {

    function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            callback(event);
        }
    }

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref]);
}
