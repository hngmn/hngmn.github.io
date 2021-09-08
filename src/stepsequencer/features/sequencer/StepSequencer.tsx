'use strict';

import * as React from 'react';

import SequencerControls from './SequencerControls';
import SequencerTracks from './SequencerTracks';

function StepSequencer() {
    return (
        <section className={'stepSequencer'}>
            <SequencerControls/>

            <SequencerTracks/>
        </section>
    );

}

export default StepSequencer;
