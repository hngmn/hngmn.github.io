'use strict';

import * as Tone from 'tone';
import classnames from 'classnames';
import * as React from 'react';

import { useAppDispatch } from '../../app/store';
import { putLocalInstrument } from '../instruments/instrumentsSlice';
import { TonePlayer } from '../instruments/classes/toneInstruments';

export default function SampleUploader() {
    const [samples, setSamples] = React.useState<File[]>([]);

    const dispatch = useAppDispatch();

    return (
        <section>
            <label>File(s)</label>
            <input
                type={'file'}
                multiple
                onChange={async (e: any) => {
                    setSamples(Array.from(e.target.files));
                }}
            />

            <button disabled={samples.length === 0} onClick={() => {
                samples.forEach((file) => {
                    dispatch(putLocalInstrument(new TonePlayer(URL.createObjectURL(file))))
                });

                setSamples([]);
            }}>
                Add to scheduler
            </button>
        </section>
    )
}
