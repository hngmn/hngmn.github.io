import * as Tone from 'tone';

import { SliderParameter, SwitchParameter } from './InstrumentParameter';
import {
    BaseInstrument,
    BaseInstrumentOptions,
    IBaseInstrumentDBObject
} from './BaseInstrument';

export interface ITonePlayerDBObject extends IBaseInstrumentDBObject {
    kind: 'TonePlayer';
    buf: ArrayBuffer;
    nChannels: number;
    length: number;
    sampleRate: number;
}

export class TonePlayer extends BaseInstrument {
    kind: 'TonePlayer';
    player: Tone.Player;
    distortion: Tone.Distortion;
    lowpass: Tone.Filter;

    constructor(url: string | AudioBuffer, options: BaseInstrumentOptions = {}) {
        if (!options.name) {
            if (typeof url === 'string') {
                options.name = url;
            } else {
                options.name = 'buffer';
            }
        }

        super(
            [
                new SliderParameter(
                    {
                        kind: 'slider',
                        name: 'lowpassHz',
                        min: 40,
                        max: 22000,
                        value: 15000,
                        step: 10,
                    },
                    (v: number) => this.lowpass.set({frequency: v})
                ),
                new SliderParameter(
                    {
                        kind: 'slider',
                        name: 'distortion',
                        min: 0.0,
                        max: 1.0,
                        value: 0.0,
                        step: 0.1,
                    },
                    (v: number) => this.distortion.set({ distortion: v })
                ),
                new SliderParameter(
                    {
                        kind: 'slider',
                        name: 'playbackRate',
                        min: 0.1,
                        max: 3.0,
                        value: 1.0,
                        step: 0.1,
                    },
                    (v: number) => { this.player.playbackRate = v; }
                ),
                new SwitchParameter(
                    {
                        kind: 'switch',
                        name: 'reverse',
                        value: false,
                    },
                    (v: boolean) => { this.player.reverse = v },
                )
            ],
            options
        );

        this.kind = 'TonePlayer';
        this.lowpass = new Tone.Filter(15000, 'lowpass').connect(this.channel);
        this.distortion = new Tone.Distortion(0.0).connect(this.lowpass);
        this.player = new Tone.Player(url).connect(this.distortion);
    }

    schedule(time: Tone.Unit.Time) {
        this.player.start(time);
    }

    toDBObject() {
        const audioBuffer = this.player.buffer.get();
        if (!audioBuffer) {
            console.error('audioBuffer undefined');
            throw Error('audioBuffer undefined');
        }

        const farray = this.player.buffer.toArray() as Float32Array;
        const buf = farray.buffer;

        return {
            kind: this.kind,
            uuid: this.getUuid(),
            name: this.getName(),
            screenName: 'TODO',
            parameters: this.getAllParameterConfigs(),
            buf: buf,
            nChannels: audioBuffer.numberOfChannels,
            length: audioBuffer.length,
            sampleRate: audioBuffer.sampleRate,
        };
    }

    static async from(dbo: ITonePlayerDBObject) {
        const floatArray: Float32Array = new Float32Array(dbo.buf);
        const audioBuf: AudioBuffer = Tone.context.createBuffer(dbo.nChannels, dbo.length, dbo.sampleRate);
        for (let i = 0; i < dbo.nChannels; i++) {
            audioBuf.copyToChannel(floatArray, i);
        }

        const player = new TonePlayer(
            audioBuf,
            {
                uuid: dbo.uuid,
                name: dbo.name,
            }
        );
        await Tone.loaded();
        return player;
    }

    static async fromFile(file: File) {
        const player = new TonePlayer(
            URL.createObjectURL(file),
            {
                name: file.name,
            }
        );
        await Tone.loaded();
        return player;
    }
}

