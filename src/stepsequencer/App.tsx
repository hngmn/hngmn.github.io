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
} from './features/instruments/instrumentsSlice';
import Loading from './features/sequencer/Loading';
import StepSequencer from './features/sequencer/StepSequencer';
import InstrumentBuilder from './features/instruments/InstrumentBuilder';
import ClickAnywhere from './ClickAnywhere';

type FetchStatus = 'notStarted' | 'pending' | 'fulfilled' | 'rejected';

function App() {
    const dispatch = useAppDispatch();
    const [clicked, setClicked] = React.useState(false);
    const [fetchNamesStatus, setFetchNamesStatus] = React.useState<FetchStatus>('notStarted');
    const [fetchSeqInsStatus, setFetchSeqInsStatus] = React.useState<FetchStatus>('notStarted');
    async function initSequencer() {
        console.log('initializing app');
        // fetch
        await instrumentPlayer.init();

        handleFetch(
            () => dispatch(fetchSequencerInstruments()).unwrap(),
            setFetchSeqInsStatus
        );

        handleFetch(
            () => dispatch(fetchDbInstrumentNames()).unwrap(),
            setFetchNamesStatus
        ).then(async (result: Array<{uuid: string, name: string}>) => {
            if (result.length === 0) {
                console.debug('found no instruments in db. initializing default instruments');
                await dispatch(initializeDefaultInstruments());
            }
        });
    }

    if (!clicked) {
        return (<ClickAnywhere onClick={() => {
            initSequencer();
            setClicked(true)
        }}/>);
    }

    return (
        <Tabs>
            <TabList>
                <Tab>Sequencer</Tab>
                <Tab>Instrument Builder</Tab>
            </TabList>

            <TabPanel>
                <Loading
                    status={fetchSeqInsStatus}
                    ready={fetchSeqInsStatus === 'fulfilled'}
                >
                    <StepSequencer/>
                </Loading>
            </TabPanel>

            <TabPanel>
                <Loading
                    status={fetchNamesStatus}
                    ready={fetchNamesStatus === 'fulfilled'}
                >
                    <InstrumentBuilder/>
                </Loading>
            </TabPanel>
        </Tabs>
    );
}

function handleFetch<T>(fetchFn: () => Promise<T>, setFetchStatus: (status: FetchStatus) => void) {
    setFetchStatus('pending');
    return fetchFn()
        .then((result: T) => {
            setFetchStatus('fulfilled')
            return result;
        })
        .catch((err: Error) => {
            setFetchStatus('rejected')
            throw err;
        });
}

export default App;
