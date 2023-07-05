import { ArgProvider } from "../pfn";

const TAU = 2*Math.PI;

/**
 *
 * @param A Amplitude
 * @param hz Frequency
 * @returns
 */
export function oscillator(A: number, scaleT = 1, center = 0) {
    return (t: number) => {
        return center + A * Math.sin(t * scaleT);
    }
}