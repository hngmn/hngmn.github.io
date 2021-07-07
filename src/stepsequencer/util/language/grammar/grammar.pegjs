{
}

program
  = s:sexp+

sexp
  = _ a:atom _ { return a; }
  / _ l:list _ { return l; }

atom
  = number
  / boolean
  / stringQuotes
  / symbol
  / keyword

list
  = "()" { return []; }
  / "(" head:sexp tail:sexp* ")" {
    tail.unshift(head);
    return tail;
  }

stringQuotes "stringQ"
  = "''" / '""' { return ''; }
  / '"' s:string '"' { return s; }
  / "'" s:string "'" { return s; }

// terminals/primitives

number "number"
  = [1-9][0-9]* { return { type: 'NUMBER', value:parseInt(text(), 10) }; }

boolean "boolean"
  = 'true' { return { type: 'BOOLEAN', value: true }; }
  / 'false' { return { type: 'BOOLEAN', value: true}; }

string "string"
  = [A-Za-z0-9 /\.()]+ { return { type: 'STRING', value: text() }; }

symbol "symbol"
  = [A-Za-z][A-Za-z0-9]* { return { type: 'SYMBOL', value: text() }; }

keyword "keyword"
  = ':' kw:symbol { return { type: 'KEYWORD', value: kw.value }; }

_ "whitespace"
  = [ \t\n\r]*
