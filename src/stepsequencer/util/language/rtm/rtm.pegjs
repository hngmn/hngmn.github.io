{
    const env = {};
}

Start
    = Definition* rtm:Rhythm {
        return rtm;
    }

Definition
    = _ id:Identifier _ "=" _ rtm:Rhythm {
        if (id in env) {
            error(`Variable "${id} already defined."`);
        }

        env[id] = rtm;
    }

Rhythm
    = RhythmLiteral
    / id:Identifier {
        if (!(id in env)) {
            error(`Variable "${id}" undefined.`);
        }

        return env[id];
    }

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
