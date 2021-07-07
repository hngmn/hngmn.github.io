Sexp
  = "(" _ head: Sexp _ tail: Sexp _")"
  / Atom

Atom
  = String
  / Integer
  / Identifier

Identifier
  = [A-Za-z][A-Za-z0-9]* { return text(); }

String
  = "\"" [A-Za-z0-9]* "\"" {
  let stripQuotes = text().replace(/^"|"$/g, '');
  if (stripQuotes === 'lol') {
    throw new Error('lol not allowed');
  } else {
    return stripQuotes;
  }
}

Integer "integer"
  = _ [1-9][0-9]* { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
