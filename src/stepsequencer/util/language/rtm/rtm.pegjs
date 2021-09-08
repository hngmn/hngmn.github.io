{
    const env = {};
}

Start
    = Rhythm
    / Integer

Rhythm
    = RhythmLiteral

RhythmLiteral
    = beats:[x. ]+ {
        return beats
            .filter(c => c != ' ')
            .map(beat => beat === 'x' ? true : false);
    }

Integer "integer"
    = [0-9]+ { return parseInt(text(), 10); }
