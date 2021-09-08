I am collecting my instrument classes here. The idea is to have a (thin?) layer of abstraction over the Tonejs classes
and modules/nodes that enables quick and easy instrument building for use in the drum sequencer.

I'll document the features I had in mind here for now.

### Envisioned Features
1. Classes expose all (or nearly all) parameters available in the Tonejs class such that a slider/knob, switch, etc can
   be exposed in the panel. This should apply to all the types of nodes, like sources, instruments, and modules.
2. Above parameters can be selectively exposed in the actual control panel.
3. All the constructs here should be translatable to the lisp-like DSL I also have in mind to make instrument building
   even more concise and human-readable.
4. something
5. Strong composability of modules/constructs
6. Local persistence of uploaded samples, also instruments (need to be able to write it to something like IndexedDB).

