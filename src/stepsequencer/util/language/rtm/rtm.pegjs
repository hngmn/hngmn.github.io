{
    // helpers //
    function printNode(text, node) {
        console.log(`text:${text}\nnode:`, JSON.stringify(node, null, 4));
    }
    // end helpers //

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
            argn: 1,
            fn: (n) => {
                return new Array(n).fill(true);
            }
        },

        empty: {
            name: 'empty',
            aliases: [],
            argn: 1,
            fn: (n) => {
                return new Array(n).fill(false);
            }
        },

        down: {
            name: 'down',
            aliases: ['first'],
            argn: 1,
            fn: (n) => {
                const rtm = new Array(n).fill(false);
                rtm[0] = true;
                return rtm;
            }
        },

        invert: {
            name: 'invert',
            aliases: ['inv'],
            argn: 1,
            fn: (rtm) => {
                return rtm.map(beat => !beat);
            }
        },

        reverse: {
            name: 'reverse',
            aliases: ['rv', 'rev'],
            argn: 1,
            fn: (rtm) => {
                return rtm.reverse();
            }
        },

        repeat: {
            name: 'repeat',
            aliases: ['rpt'],
            argn: 2,
            fn: (n, rtm) => {
                return new Array(n).fill(rtm).flat();
            }
        },

        repeatfill: {
            name: 'repeatfill',
            aliases: ['rptf'],
            argn: 2,
            fn: (n, rtm) => {
                const times = Math.ceil(n / rtm.length);
                return new Array(times).fill(rtm).flat().slice(0, n);
            },
        },

        rightshift: {
            name: 'rightshift',
            aliases: ['rs'],
            argn: 2,
            fn: (n, rtm) => {
                for (let i = 0; i < n; i++) {
                    rtm.unshift(rtm.pop());
                }
                return rtm;
            }
        },

        leftshift: {
            name: 'leftshift',
            aliases: ['ls'],
            argn: 2,
            fn: (n, rtm) => {
                for (let i = 0; i < n; i++) {
                    rtm.push(rtm.shift());
                }
                return rtm;
            }
        },

        fixedlength: {
            name: 'fixedlength',
            aliases: ['fl', 'truncate'],
            argn: 2,
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
            argn: 2,
            fn: (r1, r2) => {
                const [shorter, longer] = shorterLonger(r1, r2);

                const andRtm = Array.from(longer);
                shorter.forEach((b, index) => {
                    andRtm[index] = andRtm[index] && b;
                });

                return andRtm;
            }
        },

        bwor: {
            name: 'bwor',
            aliases: ['or'],
            argn: 2,
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
            argn: 2,
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
            argn: -1, // no argn requirement
            fn: (...rtms) => {
                return rtms.flat();
            }
        },

    };
    // map aliases
    for (const [_, builtin] of Object.entries(builtins)) {
        for (const alias of builtin.aliases) {
            if (alias in builtins) { // error - duplicate identifier
                throw new Error(`Duplicate found while mapping aliases: ${alias}`);
            }
            builtins[alias] = builtin;
        }
    }
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
        // console.log(`VariableRef: ${varName}`);
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
    = fnNameId:Identifier __ args:ExprList {
        const fnName = fnNameId.data;

        // check defined
        if (!(fnName in builtins)) {
            error(`Function ${fnName} not found`);
        }

        const fnObj = builtins[fnName];

        // check arity
        if (fnObj.argn > 0 && args.length != fnObj.argn) {
            error(`Function ${fnName} expected ${fnObj.argn} args but got ${args.length}.`);
        }

        const node = {
            type: 'FUNCTIONCALL',
            name: fnName,
            args: args,
            data: null,
        };

        try {
            const result = fnObj['fn'].apply(null, args.map(arg => arg.data));
            node.data = result;
        } catch (err) {
            printNode(text(), node);
            error(`Got error running function: ${err.message}`);
        }

        return node;
    }


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
