'use strict';

import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './App.css';
import StepSequencer from './features/sequencer/StepSequencer';
import InstrumentBuilder from './features/instruments/InstrumentBuilder';

function App() {
    return (
        <Tabs>
            <TabList>
                <Tab>Sequencer</Tab>
                <Tab>Instrument Builder</Tab>
            </TabList>

            <TabPanel>
                <StepSequencer/>
            </TabPanel>

            <TabPanel>
                <InstrumentBuilder/>
            </TabPanel>
        </Tabs>
    );
}

export default App;
