import { Coord, Pfn } from "../pfn";

export const circle: Pfn = (t: number): Coord => {
    return [Math.cos(t), Math.sin(t)];
}