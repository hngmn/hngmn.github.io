'use strict';

import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Sketch } from './Sketch';
import { flocking } from './flocking';
import { sketching, spirogrid, bulk } from './spirograph';
import { scratch } from './scratch';


export default function App(): React.ReactElement {
    return (
        <Tabs>
            <TabList>
                <Tab>Sketching</Tab>
                <Tab>Bulk</Tab>
                <Tab>Spirogrid</Tab>
                <Tab>Scratch</Tab>
                <Tab>Flocking</Tab>
            </TabList>

            <TabPanel>
                <Sketch sketch={sketching}/>
            </TabPanel>

            <TabPanel>
                <Sketch sketch={bulk}/>
            </TabPanel>

            <TabPanel>
                <Sketch sketch={spirogrid}/>
            </TabPanel>

            <TabPanel>
                <Sketch sketch={scratch}/>
            </TabPanel>

            <TabPanel>
                <Sketch sketch={flocking}/>
            </TabPanel>
        </Tabs>
    )
}
