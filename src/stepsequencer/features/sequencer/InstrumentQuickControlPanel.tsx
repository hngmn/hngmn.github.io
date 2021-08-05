'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import { removeInstrument, selectInstrumentScreenName } from '../instruments/instrumentsSlice';
import InstrumentLabel from './InstrumentLabel';
import InstrumentPlayButton from './InstrumentPlayButton';
import InstrumentQuickControls from './InstrumentQuickControls';
import InstrumentFullControlPanel from './InstrumentFullControlPanel';
import Popout from './Popout';

interface Props {
    instrumentId: string,
}

export default function InstrumentQuickControlPanel(props: Props) {
    const {
        instrumentId,
    } = props;

    const [edit, setEdit] = React.useState(false);

    const dispatch = useAppDispatch();

    const panelClassname = classnames('track', 'quickControlPanel');

    return (
        <section className={panelClassname}>
            <button
                className={classnames('removeInstrumentButton')}
                onClick={(e => dispatch(removeInstrument(instrumentId)))}
            >
                x
            </button>

            <InstrumentLabel instrumentId={instrumentId} editable={false}/>

            <InstrumentPlayButton instrumentId={instrumentId}/>

            <InstrumentQuickControls instrumentId={instrumentId} onEdit={() => setEdit(true)}/>

            {
                edit ?
                (
                    <Popout>
                        <InstrumentFullControlPanel instrumentId={instrumentId} closePanel={() => setEdit(false)}/>
                    </Popout>
                ) : null
            }
        </section>
    );
}
