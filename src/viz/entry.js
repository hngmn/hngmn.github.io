'use strict';

import p5 from 'p5';

import sketch from './sketch';


const domContainer = document.querySelector('#viz_container');
// ReactDOM.render(<App/>, domContainer);
export const myp5 = new p5(sketch, domContainer);
