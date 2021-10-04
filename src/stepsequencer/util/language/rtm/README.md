# RTM (Rhythm)
This is a small language for rhythm programming. The idea is to have a small,
powerful set of tools for writing and modifying rhythm patterns.


## General Usage
Right now the main use case is to quicken the process of filling out beats out
on my sequencer. Typing some rtm snippet into a text input on a track


## Quick Intro

### Basics

The building block is `-`s (beats) and `.`s (rests). Current resolution is 16th
notes. So the following line would represent 1 bar, with one beat on each down
beat.

```
-...-...-...-...
```


### Functions

I've built in some utilities (functions) that can be called with the following
form:

```
<Function name> { <Parameter> }*
```

Some examples:

```
all 4
  > ----

empty 8
  > ........
```


#### Musical Quantities

RTM supports quanties in musical units of times from measure (`m`), all the way
down to sixteenth notes (`s`).

```
empty 1q // 1 quarter note (4 sixteenth beats)
  > ....

// down beat of a 1q time
down 1q
  > -...
```


#### More Functions

Functions can also take other rhythms as arguments. Many of the builtin
functions also have aliases (`rightshift` can be called with `rs`).

```
// shift right 2
rightshift 2 -...-...
  > ..-...-.

rs 1e -...
  > ..-.
```


#### Nesting

Since functions return rhythms, they can be nested in other function calls.


```
rs 1e (down 1q)
  > ..-.
```

(Note: for now, nested function calls must be in parenthesis. I hope to support
omitting the parens when unambiguous.)


#### Variables

Variables are supported for storing rhythms to be referred to later.

```
qdown = down 1q

rs 1e qdown
  > ..-.
```


#### Examples

Example simple drum beat

```
// helpers
kick = rpf 2m qdown              // -...-...-...-... -...-...-...-...
hat = rs 1e kick                 // ..-...-...-...-. ..-...-...-...-.
snare = rs 1q (rpf 2m (down 1h)) // ....-.......-... ....-.......-...
```

[Here](https://hngmn.github.io/things/stepsequencer) is a working drum sequencer that supports RTM to edit each track.

## Todo
Running todo list
* implement functions as a first class member
* defun
* type system (?)
