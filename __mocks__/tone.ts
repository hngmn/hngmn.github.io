'use strict';

class Node {
    connect() {
        return this;
    }

    toDestination() {
        return this;
    }
}

export class Synth extends Node {
    triggerAttackRelease() {}
}
export class Distortion extends Node {}
export class Player extends Node {
    reverse: boolean = false;

    start() {}
}

export class Loop {
    start() {
        // console.log('start');
    }
}

class TransportC {
    bpm: any = {
        value: 60,
    };

    start() {
    }

    stop() {
    }

    setLoopPoints(start: number, end: string) {
    }

    schedule(callback: any, when: any) {
    }
}

export const Transport = new TransportC();

let isLoaded = false;
export function loaded() {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            isLoaded = true;
            resolve();
        }, 150);
    });
}

export function start() {
    // console.log('start');
}

export function now() {
    // console.log('now');
    return 42;
}
