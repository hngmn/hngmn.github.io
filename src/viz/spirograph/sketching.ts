import p5 from "p5";

export function sketching(p: p5) {
    p.setup = () => {
        const CANVAS_WIDTH = 2400;
        const CANVAS_HEIGHT = 1800;
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        p.background(204); // clear the screen
    };

    p.draw = () => {
    };
}