"use strict"

class GenericNode<T> {
    readonly kind: string;
    readonly data: T;

    constructor(kind: string, data: T) {
        this.kind = kind;
        this.data = data;
    }
}

export class IntegerNode extends GenericNode<number> {
    constructor(n: number) {
        super('INTEGER', n);
    }
}

export class IntervalNode extends GenericNode<number> {
    constructor(n: number) {
        super('INTERVAL', n);
    }
}

export class IdentifierNode extends GenericNode<string> {
    constructor(id: string) {
        super('IDENTIFIER', id);
    }
}

export class UnitNode extends GenericNode<string> {
    constructor(unit: string) {
        super('UNIT', unit);
    }
}

type Rhythm = Array<boolean>;

export class RhythmLiteralNode extends GenericNode<Rhythm> {
    constructor(rtm: Rhythm) {
        super('RHYTHMLITERAL', rtm);
    }
}

// Non-terminal Nodes (contain other nodes)

export class VariableRefNode extends GenericNode<Rhythm> {
    readonly varName: IdentifierNode;

    constructor(varName: IdentifierNode, rtm: Rhythm) {
        super('VARIABLEREF', rtm);

        this.varName = varName;
    }
}

export class FunctionCallNode extends GenericNode<Rhythm> {
    readonly name: IdentifierNode;
    readonly args: Array<RtmNode>;

    constructor(name: IdentifierNode, args: Array<RtmNode>, result: Rhythm) {
        super('FUNCTIONCALL', result);
        this.name = name;
        this.args = args;
    }
}

export type RtmNode =
    IntegerNode | IntervalNode | IdentifierNode | UnitNode | RhythmLiteralNode
    | VariableRefNode | FunctionCallNode;
