import React from 'react';
import { render, fireEvent, screen } from '../../util/test-utils';

import Pad from './Pad';

test('Pad should display on', () => {
    render(
        <Pad
            instrumentName="asdf"
            bari={0}
            beati={0}
            padi={0}
        />
    );
});
