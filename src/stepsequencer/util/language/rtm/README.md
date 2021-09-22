# RTM (Rhythm)
This is a small language for rhythm programming. The idea is to have a small,
powerful set of tools for writing and modifying rhythm patterns.

## General Usage
Right now the main use case is to quicken the process of filling out beats out
on my sequencer. Typing some rtm snippet into a text input on a track

## Syntax

The building block is `x`s (beats) and `.`s (rests). Current resolution is 16th
notes. So the following line would represent 1 bar, with one beat on each down
beat.

```
x...x...x...x...
```

I've built in some utilities (functions) that can be called with the following
form:

```
<Function name> { <Parameter> }*
```

Some examples:

```
all4
  > xxxx

empty3
  > ...

// Return a fixed length (by truncating or extending with '.'s)
fixedlength6 xxxx
  > xxxx..

fl6 xx
  > xx....

fl3 xx..xx..
  > xx.

// shift right 2
rightshift2 x...x...
  > ..x...x.

// logical Or
Or x... ..x.
  > x.x.
```

## Todo
Running todo list
* implement functions as a first class member
* defun
* type system (?)
