import { Coord, PPfn, Pfn } from "../pfn";

export const circle: PPfn<[number]> = (r: number) => (t: number): Coord => {
    return [r * Math.cos(t), r * Math.sin(t)];
}