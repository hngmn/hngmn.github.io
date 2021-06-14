'use strict';

// Constants
const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in milliseconds)
const SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)

// Given a scheduleNoteCallback, use it to schedule note plays based on tempo
// code based on https://www.html5rocks.com/en/tutorials/audio/scheduling
class Scheduler {
    constructor(scheduleNoteCallback) {
        this.wave = this.audioCtx.createPeriodicWave(wavetable.real, wavetable.imag);
        this.MAXNOTES = 4; // number of notes in sequencer
        this.isPlaying = false;
        this.tempo = 60;
        this.currentNote = 0;
        this.nextNoteTime = 0.0;

        this.scheduleNoteCallback = scheduleNoteCallback;
    }

    getTempo() {
        return this.tempo;
    }

    setTempo(newTempo) {
        this.tempo = newTempo;
    }

    playpause() {
        this.playing = !this.playing; // toggle isPlaying

        if (this.isPlaying) {
            // check if context is in suspended state (autoplay policy)
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            console.log(`nextNoteTime after setState call: ${this.state.nextNoteTime}`);
            this.scheduler();
        } else {
            window.clearTimeout(this.timerId);
        }
    }

    // Advance note by incrementing currentNote and nextNoteTime
    // currentNote will wrap around at MAXNOTES
    nextNote() {
        console.log(`nextNote called. currentNote=${this.currentNote}, nextNoteTime=${nextNoteTime}`);

        // advance the step, wrapping around MAXNOTES
        this.currentNote = (this.currentNote + 1) % this.MAXNOTES;

        // update nextNoteTime
        const secondsPerBeat = 60.0 / tempo;
        this.nextNoteTime += secondsPerBeat;
        console.log(`nextNoteTime=${this.nextNoteTime}`);
    }

    scheduler() {
        console.log('hello from scheduler');

        let n = 0; // limit n to 10 for now to prevent infinite loops
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (n < 10 && nextNoteTime < this.audioCtx.currentTime + this.SCHEDULEAHEADTIME) {
            n++;
            this.scheduleNoteCallback(currentNote, nextNoteTime);
            this.nextNote();
        }

        this.timerId = window.setTimeout(this.scheduler.bind(this), this.LOOKAHEAD);
    }
}
