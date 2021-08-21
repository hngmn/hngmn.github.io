'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../app/store';
import {
    selectSequencerInstruments,
} from './instrumentsSlice';

export default function SequencerInstrumentList() {
    const sequencerInstruments = useSelector(selectSequencerInstruments);

    return (
        <section className={classnames('sequencerInstruments')}>
            <p className={classnames('instrumentSelectColumnTitle', 'right')}>Instruments in Sequencer</p>
            <ol className={classnames('instrumentSelectList', 'right')}>
                {sequencerInstruments.map(({ uuid, name }) =>
                    <li
                        key={uuid}
                        onDoubleClick={() => {
                            console.debug(`${name} double clicked`);
                        }}
                    >{name}</li>
                )}
            </ol>
        </section>
    );
}
