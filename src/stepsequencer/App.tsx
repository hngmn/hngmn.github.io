'use strict';

import * as React from 'react';
import { useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import './App.css';
import { RootState, useAppDispatch } from './app/store';
import instrumentPlayer from './features/instruments/instrumentPlayer';
import {
    fetchDbInstrumentNames,
    initializeDefaultInstruments,
    fetchSequencerInstruments,

    selectDbFetchNamesStatus,
} from './features/instruments/instrumentsSlice';
import Loading from './features/sequencer/Loading';
import StepSequencer from './features/sequencer/StepSequencer';
import InstrumentBuilder from './features/instruments/InstrumentBuilder';

function App() {
    const dispatch = useAppDispatch();
    const [loaded, setLoaded] = React.useState(false);
    React.useEffect(() => {
        // fetch
        (async () => {
            await dispatch(fetchSequencerInstruments());
            dispatch(fetchDbInstrumentNames())
                .unwrap()
                .then((result) => {
                    if (result.length === 0) {
                        console.log('found no instruments in db. initializing default instruments');
                        dispatch(initializeDefaultInstruments());
                    }
                });

            await instrumentPlayer.getTone().loaded();


            setLoaded(true);
         })();
    }, []);

    const dbFetchNamesStatus = useSelector(selectDbFetchNamesStatus);

    return (
        <Tabs>
            <TabList>
                <Tab>Sequencer</Tab>
                <Tab>Instrument Builder</Tab>
            </TabList>

            <TabPanel>
                <Loading
                    status={dbFetchNamesStatus}
                    ready={loaded}
                >
                    <StepSequencer/>
                </Loading>
            </TabPanel>

            <TabPanel>
                <Loading
                    status={dbFetchNamesStatus}
                    ready={loaded}
                >
                    <InstrumentBuilder/>
                </Loading>
            </TabPanel>
        </Tabs>
    );
}

export default App;
