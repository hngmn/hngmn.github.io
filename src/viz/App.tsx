'use strict';

import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Sketch } from './Sketch';
import { flocking } from './flocking';
import { spirograph } from './spirograph';


export default function App(): React.ReactElement {
    return (
        <Tabs>
            <TabList>
                <Tab>Flocking</Tab>
                <Tab>Spirograph</Tab>
            </TabList>

            <TabPanel>
                <Sketch sketch={flocking}/>
            </TabPanel>

            <TabPanel>
                <Sketch sketch={spirograph}/>
            </TabPanel>
        </Tabs>
    )
}
