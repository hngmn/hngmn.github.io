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
    = _ (DefinitionList __)? rtm:Rhythm _ {
        return rtm;
    }

DefinitionList
    = Definition (__ Definition)*

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
    / "(" _ rtm:Rhythm _ ")" { return rtm; }

Function
    = "cat" __ head:Rhythm tail:(__ Rhythm)* {
        return head.concat(
            tail.map(([_, rtm]) => rtm).flat()
        );
    }

    / All n:NORINTERVAL {
        return new Array(n).fill(true);
    }

    / Empty n:NORINTERVAL {
        return new Array(n).fill(false);
    }

    / Invert __ rtm:Rhythm {
        return rtm.map(beat => !beat);
    }

    / Reverse __ rtm:Rhythm {
        return rtm.reverse();
    }

    / Repeat n:Integer __ rtm:Rhythm {
        return new Array(n).fill(rtm).flat();
    }

    / RightShift n:NORINTERVAL __ rtm:Rhythm {
        for (let i = 0; i < n; i++) {
            rtm.unshift(rtm.pop());
        }
        return rtm;
    }

    / LeftShift n:NORINTERVAL __ rtm:Rhythm {
        for (let i = 0; i < n; i++) {
            rtm.push(rtm.shift());
        }
        return rtm;
    }

    / FixedLength n:NORINTERVAL __ rtm:Rhythm {
        if (n > rtm.length) {
            return rtm.concat(new Array(n - rtm.length).fill(false));
        } else {
            return rtm.slice(n);
        }
    }

    / And __ r1:Rhythm __ r2:Rhythm {
        const [shorter, longer] = shorterLonger(r1, r2);

        const andRtm = longer;
        shorter.forEach((b, index) => {
            andRtm[index] = andRtm[index] && b;
        });

        return andRtm;
    }

    / Or __ r1:Rhythm __ r2:Rhythm {
        const [shorter, longer] = shorterLonger(r1, r2);

        const orRtm = longer;
        shorter.forEach((b, index) => {
            orRtm[index] = orRtm[index] || b;
        });

        return orRtm;
    }

    / Xor __ r1:Rhythm __ r2:Rhythm {
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
Reverse = "reverse" / "rv"
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
    = beats:[-.]+ {
        return beats
            // .filter(c => c != ' ')
            .map(beat => beat === '-' ? true : false);
    }

Interval
    = n:Integer unit:Unit {
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
    = id:[a-z]+ { return text(); }

Integer "integer"
    = [0-9]+ { return parseInt(text(), 10); }

_ "whitespaceoptional"
    = [ \t\n\r]*

__ "whitespacerequired"
    = [ \t\n\r]+
