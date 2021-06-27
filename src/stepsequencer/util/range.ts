'use strict';

// create a generator function returning an
// iterator to a specified range of numbers
export default function* range (begin: number, end: number, interval: number = 1) {
    for (let i = begin; i < end; i += interval) {
        yield i;
    }
}
