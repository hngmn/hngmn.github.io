import { ArgProvider, Coord, PPfn, getArg } from "../pfn";

export const circle: PPfn<[number]> = (r: ArgProvider) => (t: number): Coord => {
    const rr = getArg(r);
    return [rr * Math.cos(t), rr * Math.sin(t)];
}