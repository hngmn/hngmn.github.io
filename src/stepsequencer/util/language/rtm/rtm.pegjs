{
    const env = {};
    const NBEATS_PER_MEASURE = 16;

    function shorterLonger(arr1, arr2) {
        return arr1.length <= arr2.length ?
            [arr1, arr2] :
            [arr2, arr1];
    }

    const builtins = {

        all: {
            name: 'all',
            aliases: [],
            fn: (n) => {
                return new Array(n).fill(true);
            }
        },

        empty: {
            name: 'empty',
            aliases: [],
            fn: (n) => {
                return new Array(n).fill(false);
            }
        },

        invert: {
            name: 'invert',
            aliases: [],
            fn: (rtm) => {
                return rtm.map(beat => !beat);
            }
        },

        reverse: {
            name: 'reverse',
            aliases: [],
            fn: (rtm) => {
                return rtm.reverse();
            }
        },

        repeat: {
            name: 'repeat',
            aliases: [],
            fn: (n, rtm) => {
                return new Array(n).fill(rtm).flat();
            }
        },

        rightshift: {
            name: 'rightshift',
            aliases: [],
            fn: (n, rtm) => {
                for (let i = 0; i < n; i++) {
                    rtm.unshift(rtm.pop());
                }
                return rtm;
            }
        },

        leftshift: {
            name: 'leftshift',
            aliases: [],
            fn: (n, rtm) => {
                for (let i = 0; i < n; i++) {
                    rtm.push(rtm.shift());
                }
                return rtm;
            }
        },

        fixedlength: {
            name: 'fixedlength',
            aliases: [],
            fn: (n, rtm) => {
                if (n > rtm.length) {
                    return rtm.concat(new Array(n - rtm.length).fill(false));
                } else {
                    return rtm.slice(n);
                }
            }
        },

        bwand: {
            name: 'bwand',
            aliases: ['and'],
            fn: (r1, r2) => {
                const [shorter, longer] = shorterLonger(r1, r2);

                const andRtm = longer;
                shorter.forEach((b, index) => {
                    andRtm[index] = andRtm[index] && b;
                });

                return andRtm;
            }
        },

        bwor: {
            name: 'bwor',
            aliases: ['or'],
            fn: (r1, r2) => {
                const [shorter, longer] = shorterLonger(r1, r2);

                const orRtm = longer;
                shorter.forEach((b, index) => {
                    orRtm[index] = orRtm[index] || b;
                });

                return orRtm;
            }
        },

        bwxor: {
            name: 'bwxor',
            aliases: ['xor'],
            fn: (r1, r2) => {
                const [shorter, longer] = shorterLonger(r1, r2);

                const xorRtm = longer;
                shorter.forEach((b, index) => {
                    xorRtm[index] = (xorRtm[index] || b) && !(xorRtm[index] && b);
                });

                return xorRtm;
            }
        },

        cat: {
            name: 'cat',
            aliases: [],
            fn: (...rtms) => {
                return rtms.flat();
            }
        },

    };
}

Start
    = _ (DefinitionList __)? rtm:Rhythm _ {
        return rtm.data;
    }

DefinitionList
    = Definition (__ Definition)*

Definition
    = variable:Identifier _ "=" _ rtm:Rhythm {
        const varName = variable.data;
        if (varName in env) {
            error(`Variable "${varName} already defined."`);
        }

        env[varName] = rtm.data;
    }

Expr
    = Rhythm
    / Primitive

ExprList
    = head:Expr tail:(__ Expr)* {
        return [head].concat(
            tail.map(([_, expr]) => expr).flat()
        );
    }

Rhythm
    = RhythmLiteral
    / FunctionCall
    / VariableRef
    / "(" _ rtm:Rhythm _ ")" { return rtm; }

VariableRef
    = v:Identifier {
        const varName = v.data;
        console.log(`VariableRef: ${varName}`);
        if (!(varName in env)) {
            error(`Variable "${varName}" undefined.`);
        }

        return {
            type: 'VARIABLE',
            variable: varName,
            data: env[varName],
        }
    }

FunctionCall
    = fn:Identifier __ args:ExprList {
        // console.log(`FunctionCall: ${fn.data}, ${args.length} args`);
        // args.forEach((arg, index) => console.log(`${index}: `, arg));

        const fnName = fn.data;
        if (!(fnName in builtins)) {
            error(`Function ${fnName} not found`);
        }

        const result = builtins[fnName]['fn'].apply(null, args.map(arg => arg.data));
        // console.log('result: ', result);
        const node = {
            type: 'FUNCTIONCALL',
            name: fnName,
            args: args,
            data: result,
        };
        console.log('FUNCTIONCALL: ', node);
        return node;
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
        return {
            type: 'LITERAL',
            data: beats.map(beat => beat === '-' ? true : false),
        };
    }

Primitive = Interval / Unit / Integer

Interval
    = n:Integer unit:Unit {
        const unitMap = {
            m: NBEATS_PER_MEASURE,
            h: NBEATS_PER_MEASURE / 2,
            q: NBEATS_PER_MEASURE / 4,
            e: NBEATS_PER_MEASURE / 8,
            s: NBEATS_PER_MEASURE / 16
        }

        return {
            type: 'INTERVAL',
            data: n.data * unitMap[unit.data],
        };
    }

Unit = [mhqes] {
    return {
        type: 'UNIT',
        data: text(),
    }
}

Identifier
    = [a-z]+ {
        return {
            type: 'IDENTIFIER',
            data: text(),
        };
    }

Integer "integer"
    = [0-9]+ {
        return {
            type: 'INTEGER',
            data: parseInt(text(), 10),
        };
    }

_ "whitespaceoptional"
    = [ \t\n\r]*

__ "whitespacerequired"
    = [ \t\n\r]+
