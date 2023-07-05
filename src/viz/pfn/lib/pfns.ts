import { ArgProvider, Coord, PPfn, getArg } from "../pfn";

export const circle: PPfn<[ArgProvider]> = (r: ArgProvider) => (t: number): Coord => {
    const rr = getArg(r, t);
    return [rr * Math.cos(t), rr * Math.sin(t)];
}

export const ellipse: PPfn<[ArgProvider, ArgProvider]> = (a: ArgProvider, b: ArgProvider) => (t: number): Coord => {
    const aa = getArg(a, t);
    const bb = getArg(b, t);
    return [aa * Math.cos(t), bb * Math.sin(t)];
}