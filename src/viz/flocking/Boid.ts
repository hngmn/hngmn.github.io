import type p5 from "p5";

export interface Boid {
    position: p5.Vector;
    velocity: p5.Vector;
    run: (boids: Boid[]) => void;
}

export class DefaultBoid implements Boid {
    private p: p5;
    position: p5.Vector;
    velocity: p5.Vector;
    private acceleration: p5.Vector;
    private r: number;
    private maxSpeed: number;
    private maxForce: number;

    constructor(p: p5, x: number, y: number) {
        this.p = p;
        this.position = p.createVector(x, y);
        this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
        this.acceleration = p.createVector(0, 0);
        this.r = 3.0;
        this.maxSpeed = 3;    // Maximum speed
        this.maxForce = 0.05; // Maximum steering force
    }

    run(boids: Boid[]): void {
        this.flock(boids);
        this.update();
        this.borders();
        this.render();
    }

    flock(boids: Boid[]): void {
        const sep = this.separate(boids);   // Separation
        const ali = this.align(boids);      // Alignment
        const coh = this.cohesion(boids);   // Cohesion
        // Arbitrarily weight these forces
        sep.mult(1.5);
        ali.mult(1.0);
        coh.mult(1.0);
        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
    }

    // Method checks for nearby boids and steers away
    separate(boids: Boid[]): p5.Vector {
        let desiredseparation = 25.0;
        let steer = this.p.createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        for (let i = 0; i < boids.length; i++) {
            let d = this.position.dist(boids[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < desiredseparation)) {
                // Calculate vector pointing away from neighbor
                let diff = this.position.copy().sub(boids[i].position);
                diff.normalize();
                diff.div(d);        // Weight by distance
                steer.add(diff);
                count++;            // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer.div(count);
        }

        // As long as the vector is greater than 0
        if (steer.mag() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize();
            steer.mult(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }
        return steer;
    }

    // For every nearby boid in the system, calculate the average velocity
    align(boids: Boid[]): p5.Vector {
        let neighbordist = 50;
        let sum = this.p.createVector(0, 0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = this.position.dist(boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(boids[i].velocity);
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            sum.normalize();
            sum.mult(this.maxSpeed);
            let steer = sum.copy().sub(this.velocity);
            steer.limit(this.maxForce);
            return steer;
        } else {
            return this.p.createVector(0, 0);
        }
    }

    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohesion(boids: Boid[]): p5.Vector {
        let neighbordist = 50;
        let sum = this.p.createVector(0, 0);   // Start with empty vector to accumulate all locations
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = this.position.dist(boids[i].position);
            if ((d > 0) && (d < neighbordist)) {
                sum.add(boids[i].position); // Add location
                count++;
            }
        }
        if (count > 0) {
            sum.div(count);
            return this.seek(sum);  // Steer towards the location
        } else {
            return this.p.createVector(0, 0);
        }
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target: p5.Vector): p5.Vector {
        let desired = target.copy().sub(this.position);  // A vector pointing from the location to the target
        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.maxSpeed);
        // Steering = Desired minus Velocity
        let steer = desired.copy().sub(this.velocity);
        steer.limit(this.maxForce);  // Limit to maximum steering force
        return steer;
    }

    applyForce(force: p5.Vector): void {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    update(): void {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        // Reset accelertion to 0 each cycle
        this.acceleration.mult(0);
    }

    borders(): void {
        if (this.position.x < -this.r) this.position.x = this.p.width + this.r;
        if (this.position.y < -this.r) this.position.y = this.p.height + this.r;
        if (this.position.x > this.p.width + this.r) this.position.x = -this.r;
        if (this.position.y > this.p.height + this.r) this.position.y = -this.r;
    }

    render(): void {
        // Draw a triangle rotated in the direction of velocity
        let theta = this.velocity.heading() + this.p.radians(90);
        this.p.fill(127);
        this.p.stroke(200);
        this.p.push();
        this.p.translate(this.position.x, this.position.y);
        this.p.rotate(theta);
        this.p.beginShape();
        this.p.vertex(0, -this.r * 2);
        this.p.vertex(-this.r, this.r * 2);
        this.p.vertex(this.r, this.r * 2);
        this.p.endShape(this.p.CLOSE);
        this.p.pop();
    }
}