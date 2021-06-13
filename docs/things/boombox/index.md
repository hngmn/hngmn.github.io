---
layout: page
---

This is a project page with inline html and an included React component. It is a boombox with a play/pause and volume
slider. The audio is just a random drum sample.

<audio src="/assets/audio/lazertom.wav" crossorigin="anonymous"></audio>

{% include reactcomponent.html id='boombox_container' scriptpath='/js/boombox/bundle.js' %}
