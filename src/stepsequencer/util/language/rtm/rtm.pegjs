{
    const env = {};
}

Start
    = Integer

Integer "integer"
    = [0-9]+ { return parseInt(text(), 10); }
