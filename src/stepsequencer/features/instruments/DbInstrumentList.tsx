'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { RootState, useAppDispatch } from '../../app/store';
import {
    selectSequencerInstruments,
    selectAvailableInstrumentNames,
} from './instrumentsSlice';


export default function DbInstrumentList() {
    const dbInstruments = useSelector(selectAvailableInstrumentNames);
    const sequencerInstruments = useSelector(selectSequencerInstruments);
    const availableInstruments = dbInstruments.filter(ins => !sequencerInstruments.includes(ins));
    console.debug('DbInstrumentList dbInstruments:', dbInstruments);
    console.debug('DbInstrumentList sequencerInstruments:', sequencerInstruments);
    console.debug('DbInstrumentList availableInstruments:', availableInstruments);

    return (
        <section className={classnames('availableInstruments')}>
            <p className={classnames('instrumentSelectColumnTitle', 'left')}>Available to add</p>
            <ol className={classnames('instrumentSelectList', 'left')}>
                {availableInstruments.map(({ uuid, name }) =>
                    <li
                        key={uuid}
                        onDoubleClick={(e: React.MouseEvent) => {
                            console.debug(`${name} double clicked`);
                        }}
                    >{name}</li>
                )}
            </ol>
        </section>
    );
}
