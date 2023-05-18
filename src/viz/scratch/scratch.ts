import p5 from "p5";
import { SingleEntryPlugin } from "webpack";

function circles(p: p5) {
    let t = 0, tstep = 0.25;
    const width = (t: number) => {
        return 140 - (69 * p.abs(p.cos(t / 11.617)));
    };
    const height = (t: number) => {
        return 70 + (150 * p.abs(p.cos(t / 7.638)));
    }
    const x = (t: number) => {
        return 250 * (p.sin(t/10)+p.sin(t/20)+p.sin(t/30));
    };
    const y = (t: number) => {
        return 175 * (p.cos(t/10)+p.cos(t/20)+p.cos(t/30));
    }
    let fr = 60;

    p.setup = () => {
        p.createCanvas(2400, 1600);
        p.background(200);
        p.frameRate(fr); // Attempt to refresh at starting FPS
    }

    p.draw = () => {
        // center
        p.translate(p.width / 2, p.height / 2);

        p.noFill();
        p.strokeWeight(1);
        p.ellipse(x(t), y(t), width(t), height(t));

        t += tstep;
    }
}

function spiral(p: p5) {
    // polar coordinates to draw a spiral
    let r = 5;
    let theta = 0;
    let rp = 0.25;
    let thetap = 0.05;
    let px = 0, py = 0;

    p.setup = () => {
        p.createCanvas(2400, 1600);
        p.background(100);
    };

    p.draw = () => {
        // center
        p.translate(p.width / 2, p.height / 2);

        const [x, y] = polarToCartesian(r, theta);
        p.strokeWeight(3);
        p.line(px, py, x, y);

        [px, py] = [x, y];
        r += rp;
        theta += thetap;
    };

    function polarToCartesian(r: number, theta: number): [number, number] {
        return [r * p.cos(theta), r * p.sin(theta)];
    }

}

// export
export const scratch = spiral;