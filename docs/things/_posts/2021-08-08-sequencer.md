---
layout: post
title: "Drum Sequencer"
date:   2021-08-08 00:10:00 -0700
---

This project is the starting point for a much larger project I've envisioned for a long time regarding two passions of
mine, music (and music production) and programming languages. The vision, in short, is something like a domain-specifc
language (DSL), or similar toolset, for easy, powerful (composable) creation and modification of digital sounds.

The first step was to actually learn the tools for synthesis and playback of digital sounds in the browser, the Web
Audio API. I would also need a fun place to playback the products of my envisioned DSL, so a drum sequencer was a perfect
first project. The MDN WebAudio API tutorial is literally that, so that's what I loosely followed to build this. The
concepts are all here, but the code is totally different to follow React-Redux design principles and also to enable
the instrument-building capabilities I have in mind.

The project is [here]({% link things/stepsequencer/index.html %}). Right now it is just the sequencer, with pre-loaded
samples and a hard-coded set of parameters exposed. Local audio files can be uploaded to play those back with the same
set of parameters. What's next is the hard part, which is designing the tools for instrument-building and exposing those
in a coherent UI.
