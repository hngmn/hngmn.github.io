'use strict';

import * as Tone from 'tone';
import { Ok, Err, Result } from 'ts-results';

import instrumentPlayer from '../instrumentPlayer';
import type {
    IInstrument,
    IInstrumentDBObject,
} from '../classes';
import { TonePlayer } from './TonePlayer';
import { ToneSynth } from './ToneSynth';
import { Conjunction } from './Conjunction';
import { Disjunction } from './Disjunction';

export async function defaultInstruments(): Promise<Array<IInstrument>> {
    const instruments = [
        new Disjunction(
            new TonePlayer('/assets/audio/shaker1.wav'),
            new TonePlayer('/assets/audio/shaker2.wav'),
        ),
        new TonePlayer('/assets/audio/hat.wav'),
        new TonePlayer('/assets/audio/lazertom.wav'),
        new TonePlayer('/assets/audio/electrotom.wav'),
        new TonePlayer('/assets/audio/snare.wav'),
        new Conjunction(
            new TonePlayer('/assets/audio/kick.wav'),
            new ToneSynth({ name: 'synth' })
        ),
    ];
    await instrumentPlayer.getTone().loaded();

    return instruments;
}

export async function dboToInstrument(dbo: IInstrumentDBObject): Promise<Result<IInstrument, Error>> {
    let ins;
    switch (dbo.kind) {
    case 'ToneSynth':
        ins = await ToneSynth.from(dbo);
        return Ok(ins);
    case 'TonePlayer':
        ins = await TonePlayer.from(dbo);
        return Ok(ins);
    case 'Conjunction':
        ins = await Conjunction.from(dbo);
        return Ok(ins);
    case 'Disjunction':
        ins = await Disjunction.from(dbo);
        return Ok(ins);
    default:
        console.error('Not recognized IInstrument');
        return Err(new Error(`Unrecognized instrument type: ${dbo}`));
    }
}
