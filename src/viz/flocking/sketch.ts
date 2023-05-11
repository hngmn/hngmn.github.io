import type p5 from 'p5';

import { DefaultBoid } from './Boid';
import { DefaultFlock, Flock } from './Flock';


export default function(p: p5) {
    let flock: Flock;
    p.setup = () => {
        p.createCanvas(1200, 600);

        flock = new DefaultFlock();
        // initialize with Boids
        for (let i = 0; i < 200; i++) {
            let b = new DefaultBoid(p, p.width / 2, p.height / 2);
            flock.addBoid(b);
          }
    }

    p.draw = () => {
        p.background(51);
        flock.run();
    }
}