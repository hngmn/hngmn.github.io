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

export async function defaultInstruments() {
    const instruments = [
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
    switch (dbo.kind) {
    case 'ToneSynth':
        const synth = await ToneSynth.from(dbo);
        return Ok(synth);
    case 'TonePlayer':
        const player = await TonePlayer.from(dbo);
        return Ok(player);
    case 'Conjunction':
        const cjx = await Conjunction.from(dbo);
        return Ok(cjx);
    default:
        console.error('Not recognized IInstrument');
        return Err(new Error(`Unrecognized instrument type: ${dbo}`));
    }
}
