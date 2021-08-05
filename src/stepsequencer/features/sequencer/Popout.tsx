'use strict';

import * as React from 'react';
import ReactDOM from 'react-dom';

interface Props {
    children: any;
}

export default function Popout(props: Props) {
    const domContainer = document.querySelector('#stepsequencer_container');

    return ReactDOM.createPortal(
        props.children,
        domContainer!
    );
}
