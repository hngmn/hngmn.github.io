import * as React from 'react';
import p5 from 'p5';

interface Props {
    sketch: (p: p5) => any;
}

export function Sketch({ sketch }: Props): React.ReactElement {
    React.useEffect(() => {
        const p5sketch = new p5(sketch);
        return () => {
            p5sketch.remove();
        }
    });
    return (<></>)
}