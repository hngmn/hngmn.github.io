'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../app/store';
import {
    playInstrument,
    unstageInstrument,

    selectSequencerInstruments,
} from './instrumentsSlice';

export default function SequencerInstrumentList(): React.ReactElement {
    const sequencerInstruments = useSelector(selectSequencerInstruments);

    const dispatch = useAppDispatch();

    return (
        <section className={classnames('sequencerInstruments')}>
            <p className={classnames('instrumentSelectColumnTitle', 'right')}>Staged Instruments</p>

            <ol className={classnames('instrumentSelectList', 'right')}>
                {sequencerInstruments.map(({ uuid, name }) =>
                    <li
                        key={uuid}
                        onDoubleClick={() => {
                            console.debug(`${name} double clicked`);
                            dispatch(playInstrument(uuid));
                        }}
                    >
                        <span className={classnames('sequencerInstrumentsListItem')}>
                            {name}

                            <button
                                onClick={() => dispatch(unstageInstrument(uuid))}
                            >
                                Unstage
                            </button>
                        </span>
                    </li>
                )}
            </ol>
        </section>
    );
}
