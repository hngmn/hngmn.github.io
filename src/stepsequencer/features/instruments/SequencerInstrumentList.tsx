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
            <p className={classnames('instrumentListTitle')}>Staged Instruments</p>

            <ol className={classnames('instrumentSelectList', 'right')}>
                {sequencerInstruments.map(({ uuid, name }, index) =>
                    <li
                        className={classnames('instrumentListItem', 'sequencer')}
                        key={uuid}
                        onClick={() => {
                            dispatch(playInstrument(uuid));
                        }}
                    >
                        {`${index+1}. ${name}`}

                        <div className={classnames('spacer')}/>

                        <button
                            onClick={() => dispatch(unstageInstrument(uuid))}
                        >
                            Unstage
                        </button>
                    </li>
                )}
            </ol>
        </section>
    );
}
