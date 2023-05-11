'use strict';

import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Sketch } from './Sketch';
import { flocking } from './flocking';
import { spirograph } from './spirograph';
import { scratch } from './scratch';


export default function App(): React.ReactElement {
    return (
        <Tabs>
            <TabList>
                <Tab>Spirograph</Tab>
                <Tab>Scratch</Tab>
                <Tab>Flocking</Tab>
            </TabList>

            <TabPanel>
                <Sketch sketch={spirograph}/>
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
