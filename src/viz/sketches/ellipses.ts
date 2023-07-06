/**
 * bulk drawing spirographs from import/csv/other
 */

import p5 from "p5";
import { ellipse, pfnAdd, radialOsc, rotate, rotatePTfn, scaleT } from "../pfn";
import _ from "lodash";
import { addDrawControl, getPfnDrawFn } from "../pfn/draw";
import { fromHex, oscThreeColors, oscTwoColors } from "../p5util";


export function ellipses(p: p5) {
    const dc = addDrawControl(p);
    const initialColor = [206, 112, 112] as const;
    const endColor = [156, 20, 215] as const;

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(249); // clear the screen
        p.frameRate(30);

        const R = p.height/2; // screen radius
        const outerR = R*0.7;
        const a = R/4;
        const b = R/6;
        const outerCircleScaleT = 0.002;
        const outerEllipse = ellipse(outerR*1.7, outerR);
        // rotation synced to outer circle movement
        const rotateSyncedEllipse = rotatePTfn(outerCircleScaleT)(rotate(Math.PI)(ellipse(a, b)));
        const c = pfnAdd(
            radialOsc(outerR*0.05, 5.7)(scaleT(outerCircleScaleT)(outerEllipse)),
            scaleT(1)(rotateSyncedEllipse),
        );
        dc(getPfnDrawFn(p, c, {
            tStep: 0.01,
            frameRateMult: 256,
            stroke: oscTwoColors(initialColor, endColor, { speedMultiplier: 0.001 }),
        }));

        // inner smaller loop
        const a2 = R/8;
        const b2 = R/10;
        const rotateSyncedEllipse2 = rotatePTfn(outerCircleScaleT)(rotate(Math.PI)(ellipse(a2, b2)));
        const c2 = pfnAdd(
            radialOsc(outerR*0.04, 9.7)(scaleT(outerCircleScaleT)(outerEllipse)),
            scaleT(1)(rotateSyncedEllipse2),
        );
        dc(getPfnDrawFn(p, c2, {
            tStep: 0.01,
            frameRateMult: 256,
            stroke: oscThreeColors(endColor, fromHex('FFD23F'), initialColor, { speedMultiplier: 0.001 }),
        }));
    };
}