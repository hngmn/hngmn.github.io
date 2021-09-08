{
    const env = {};
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
    
    / All n:Integer {
        return new Array(n).fill(true);
    }

    / Empty n:Integer {
        return new Array(n).fill(false);
    }

    / Invert _ rtm:Rhythm {
        return rtm.map(beat => !beat);
    }

    / FixedLength n:Integer _ rtm:Rhythm {
        if (n > rtm.length) {
            return rtm.concat(new Array(n - rtm.length).fill(false));
        } else {
            return rtm.slice(n);
        }
    }

    / Repeat n:Integer _ rtm:Rhythm {
        return new Array(n).fill(rtm).flat();
    }

// Function names
All = "all" / "a"
Empty = "empty" / "e"
Invert = "invert" / "i"
FixedLength = "fixedlength" / "fl"
Repeat = "repeat" / "rpt" / "r"


// Terminals

RhythmLiteral
    = _ beats:[x. ]+ {
        return beats
            .filter(c => c != ' ')
            .map(beat => beat === 'x' ? true : false);
    }

Identifier
    = _ id:[a-z]+ { return id; }

Integer "integer"
    = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
    = [ \t\n\r]*

_l
    = [ \t]*
