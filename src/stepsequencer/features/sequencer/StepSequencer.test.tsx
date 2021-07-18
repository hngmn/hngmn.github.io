'use strict';

import React from 'react';
import { render, fireEvent, screen } from '../../util/test-utils';

import StepSequencer from './StepSequencer';

test('StepSequencer should render', () => {
    render(<StepSequencer/>);
})
