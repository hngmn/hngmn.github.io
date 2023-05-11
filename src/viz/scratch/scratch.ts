import p5 from "p5";

export function scratch(p: p5) {
    p.setup = () => {
        p.createCanvas(710, 400);
        p.background(204); // clear the screen
    }

    p.draw = () => {
        p.noFill();
        p.stroke(255, 102, 0);
        p.line(185, 120, 10, 10);
        p.line(190, 190, 15, 80);
        p.stroke(0, 0, 0);
        p.bezier(185, 120, 10, 10, 190, 190, 15, 80);
    }
}