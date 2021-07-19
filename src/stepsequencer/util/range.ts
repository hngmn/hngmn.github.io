'use strict';

export default function range(n: number): Array<number> {
    return [...rangeGenerator(0, n)];
}

function* rangeGenerator (begin: number, end: number, interval: number = 1) {
    for (let i = begin; i < end; i += interval) {
        yield i;
    }
}
