import { Boid } from "./Boid";

export interface Flock {
    run: () => void;
    addBoid: (boid: Boid) => void;
}

export class DefaultFlock {
    private boids: Boid[];
    constructor() {
        this.boids = [];
    }

    run(): void {
        for (let boid of this.boids) {
            boid.run(this.boids); // n^2
        }
    }

    addBoid(boid: Boid): void {
        this.boids.push(boid);
    }
}