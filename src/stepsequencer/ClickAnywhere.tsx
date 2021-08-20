'use strict';

import * as React from 'react';
import classnames from 'classnames';


interface Props {
    onClick: () => void,
}

export default function ClickAnywhere(props: Props) {
    const { onClick } = props;

    React.useEffect(() => {
        document.addEventListener('click', onClick, false);

        return () => document.removeEventListener('click', onClick, false);
    }, []);

    return (
        <div className={classnames('clickToStart')} onClick={onClick}>
            <p>Click Anywhere to Start...</p>
        </div>
    )
}
