'use strict';

import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './App.css';
import { Sketch } from './Sketch';
import { flocking } from './flocking';
import { ellipses } from './sketches/ellipses';
import { sketching } from './spirograph';
import { radialOscSpiro } from './spirograph/radialosc';
import { rotateShrink } from './spirograph/rotateshrink';


export default function App(): React.ReactElement {
    type NameSketch = [string, typeof flocking];
    const sketches: NameSketch[] = [
        ['ellipses', ellipses],
        ['radialosc', radialOscSpiro],
        ['rs', rotateShrink],
        ['Sketching', sketching],
    ];
    return (
        <Tabs>
            <TabList>
                {sketches.map(s => s[0]).map(name => (<Tab>{name}</Tab>))}
            </TabList>

            {sketches.map(s => s[1]).map(sketch => (
                <TabPanel>
                    <Sketch sketch={sketch}/>
                </TabPanel>
            ))}
        </Tabs>
    )
}
