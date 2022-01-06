'use strict';

export class Switch {
    on: boolean;

    constructor() {
        this.on = false;
    }

    set(b: boolean): boolean {
        return this.on = b;
    }

    toggle(): boolean {
        return this.on = !this.on;
    }
}

// Switch but with greater than 2 states. n is number of states.
export class MultiSwitch {
    value: number;
    n: number;

    constructor(n: number) {
        this.value = 0;
        this.n = n;
    }

    set(v: number): number {
        return this.value = v;
    }

    cycle(): number {
        return this.value = (this.value + 1) % this.n;
    }
}
