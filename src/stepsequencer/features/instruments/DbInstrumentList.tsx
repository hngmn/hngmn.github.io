'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '../../app/store';
import {
    deleteInstrumentFromDb,
    playInstrument,
    stageInstrument,

    selectSequencerInstruments,
    selectAvailableInstrumentNames,
} from './instrumentsSlice';


export default function DbInstrumentList(): React.ReactElement {
    const dbInstruments = useSelector(selectAvailableInstrumentNames);
    const sequencerInstruments = useSelector(selectSequencerInstruments);
    const availableInstruments = dbInstruments.filter(
        dbIns => !sequencerInstruments.map(seqIns => seqIns.uuid).includes(dbIns.uuid));
    console.debug('DbInstrumentList dbInstruments:', dbInstruments);
    console.debug('DbInstrumentList sequencerInstruments:', sequencerInstruments);
    console.debug('DbInstrumentList availableInstruments:', availableInstruments);

    const dispatch = useAppDispatch();

    return (
        <section className={classnames('availableInstruments')}>

            <p className={classnames('instrumentSelectColumnTitle', 'left')}>Available to add</p>

            <ol className={classnames('instrumentSelectList', 'left')}>
                {availableInstruments.map(({ uuid, name }, index) =>
                    <li
                        key={uuid}
                        onDoubleClick={(e: React.MouseEvent) => {
                            console.debug(`${name} double clicked`, e);
                            dispatch(playInstrument(uuid));
                        }}
                    >
                        <span>
                            <button
                                onClick={() => dispatch(deleteInstrumentFromDb(uuid))}
                            >
                                x
                            </button>

                            {`${index}. ${name}`}

                            <button
                                onClick={() => dispatch(stageInstrument(uuid))}
                            >
                                Stage
                            </button>
                        </span>
                    </li>
                )}
            </ol>

        </section>
    );
}
