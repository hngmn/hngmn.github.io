### About
This is a React-Redux app for a step sequencer. I started it by following the MDN Web Audio API tutorial, modifying to fit
React-Redux design principles and my vision for the instrument-building capabilities and constructs.

### Tech
CSS from scratch
Typescript
React-Redux (with React Hooks API)
Tonejs (wrapper for Web Audio APIs)
Jest and React-Testing-Library

# Todo
* Local persistence
  * [x] save instruments
  * [x] handle instrument ids, names, screennames
  * [x] save sequencer state
  * [ ] something like a DSL for specifying instruments that can be played and
    configured in the sequencer (syntax lisp-like or json)
  * [ ] instrument parameters can be picked here to be exposed in the sequencer
        control panels
  * [x] auxiliary features include instrument CRUD, sampling, parameter
        configuration

