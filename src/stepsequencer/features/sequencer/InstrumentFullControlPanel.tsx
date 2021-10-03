'use strict';

import classnames from 'classnames';
import * as React from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch, RootState } from '../../app/store';
import useDetectOutsideClick from '../../util/useDetectOutsideClick';
import { selectInstrumentScreenName } from '../instruments/instrumentsSlice';
import InstrumentLabel from './InstrumentLabel';
import InstrumentPlayButton from './InstrumentPlayButton';
import InstrumentParameters from './InstrumentParameters';
import RtmBox from './RtmBox';

interface Props {
    instrumentId: string,
    closePanel: () => void,
}

export default function InstrumentFullControlPanel(props: Props) {
    const {
        instrumentId,
        closePanel,
    } = props;

    const classname = classnames('fullControlPanel');

    const panelRef = React.useRef(null);
    useDetectOutsideClick(panelRef, closePanel);

    return (
        <section ref={panelRef} className={classname}>
            <span>
                <InstrumentLabel instrumentId={instrumentId} editable={true}/>

                <InstrumentPlayButton instrumentId={instrumentId} keyboardShortcut={'s'}/>
            </span>

            <RtmBox instrumentId={instrumentId}/>

            <InstrumentParameters instrumentId={instrumentId}/>
        </section>
    );
}
