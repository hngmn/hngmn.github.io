{
    const env = {};
    const NBEATS_PER_MEASURE = 16;

    function shorterLonger(arr1, arr2) {
        return arr1.length <= arr2.length ?
            [arr1, arr2] :
            [arr2, arr1];
    }
}

Start
    = Definition* rtm:Rhythm {
        return rtm;
    }

Definition
    = id:Identifier _ "=" _ rtm:Rhythm {
        if (id in env) {
            error(`Variable "${id} already defined."`);
        }

        env[id] = rtm;
    }

Rhythm
    = RhythmLiteral
    / Function
    / id:Identifier {
        if (!(id in env)) {
            error(`Variable "${id}" undefined.`);
        }

        return env[id];
    }

Function
    = "cat" _ rtms:Rhythm+ {
        return rtms.flat();
    }
    
    / All n:NORINTERVAL {
        return new Array(n).fill(true);
    }

    / Empty n:NORINTERVAL {
        return new Array(n).fill(false);
    }

    / Invert _ rtm:Rhythm {
        return rtm.map(beat => !beat);
    }

    / FixedLength n:NORINTERVAL _ rtm:Rhythm {
        if (n > rtm.length) {
            return rtm.concat(new Array(n - rtm.length).fill(false));
        } else {
            return rtm.slice(n);
        }
    }

    / Repeat n:Integer _ rtm:Rhythm {
        return new Array(n).fill(rtm).flat();
    }

    / RightShift n:NORINTERVAL _ rtm:Rhythm {
        for (let i = 0; i < n; i++) {
            rtm.unshift(rtm.pop());
        }
        return rtm;
    }

    / LeftShift n:NORINTERVAL _ rtm:Rhythm {
        for (let i = 0; i < n; i++) {
            rtm.push(rtm.shift());
        }
        return rtm;
    }

    / And r1:Rhythm r2:Rhythm {
        const [shorter, longer] = shorterLonger(r1, r2);

        const andRtm = longer;
        shorter.forEach((b, index) => {
            andRtm[index] = andRtm[index] && b;
        });

        return andRtm;
    }

    / Or r1:Rhythm r2:Rhythm {
        const [shorter, longer] = shorterLonger(r1, r2);

        const orRtm = longer;
        shorter.forEach((b, index) => {
            orRtm[index] = orRtm[index] || b;
        });

        return orRtm;
    }

    / Xor r1:Rhythm r2:Rhythm {
        const [shorter, longer] = shorterLonger(r1, r2);

        const xorRtm = longer;
        shorter.forEach((b, index) => {
            xorRtm[index] = (xorRtm[index] || b) && !(xorRtm[index] && b);
        });

        return xorRtm;
    }

// Function names
All = "all" / "a"
Empty = "empty" / "e"
Invert = "invert" / "i"
FixedLength = "fixedlength" / "fl"
Repeat = "repeat" / "rpt" / "r"
RightShift = "rs"
LeftShift = "ls"
And = "and" / "both" / "overlap"
Or = "or" / "either" / "merge"
Xor = "exor"

NORINTERVAL = Interval / Integer

// Terminals

RhythmLiteral
    = _ beats:[x.]+ {
        return beats
            // .filter(c => c != ' ')
            .map(beat => beat === 'x' ? true : false);
    }

Interval
    = _ n:Integer unit:Unit {
        const unitMap = {
            m: NBEATS_PER_MEASURE,
            h: NBEATS_PER_MEASURE / 2,
            q: NBEATS_PER_MEASURE / 4,
            e: NBEATS_PER_MEASURE / 8,
            s: NBEATS_PER_MEASURE / 16
        }

        return n * unitMap[unit];
    }

Unit = [mhqes]

Identifier
    = _ id:[a-z]+ { return id; }

Integer "integer"
    = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
    = [ \t\n\r]*
