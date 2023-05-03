import type p5 from 'p5';

import { Flock, DefaultFlock, DefaultBoid } from './flocking';

export default (p: p5) => {
    let flock: Flock;
    p.setup = () => {
        p.createCanvas(1000, 800);
        p.createP("Drag the mouse to generate new boids.");

        flock = new DefaultFlock();
        // initialize with Boids
        for (let i = 0; i < 100; i++) {
            let b = new DefaultBoid(p, p.width / 2, p.height / 2);
            flock.addBoid(b);
          }
    }

    p.draw = () => {
        p.background(51);
        flock.run();
    }
}