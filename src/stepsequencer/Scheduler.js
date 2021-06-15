'use strict';

// Constants
const LOOKAHEAD = 25.0; // How frequently to call scheduling function (in milliseconds)
const SCHEDULEAHEADTIME = 0.1; // How far ahead to schedule audio (sec)

// Given a scheduleNoteCallback, use it to schedule note plays based on tempo
// code based on https://www.html5rocks.com/en/tutorials/audio/scheduling
export default class Scheduler {
    constructor(audioCtx, scheduleNoteCallback, updateNoteCallback) {
        this.MAXNOTES = 4; // number of notes in sequencer
        this.isPlaying = false;
        this.tempo = 60;
        this.currentNote = 0;
        this.nextNoteTime = 0.0;

        this.audioCtx = audioCtx;
        this.scheduleNoteCallback = scheduleNoteCallback;
        this.updateNoteCallback = updateNoteCallback;
    }

    getTempo() {
        return this.tempo;
    }

    setTempo(newTempo) {
        this.tempo = newTempo;
    }

    playpause() {
        this.isPlaying = !this.isPlaying; // toggle isPlaying

        if (this.isPlaying) {
            // check if context is in suspended state (autoplay policy)
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            this.nextNoteTime = this.audioCtx.currentTime;

            this.schedule();
        } else {
            window.clearTimeout(this.timerId);
        }
    }

    // Advance note by incrementing currentNote and nextNoteTime
    // currentNote will wrap around at MAXNOTES
    nextNote() {
        // advance the step, wrapping around MAXNOTES
        this.currentNote = (this.currentNote + 1) % this.MAXNOTES;
        this.updateNoteCallback(this.currentNote); // update StepSequencer with the new note

        // update nextNoteTime
        const secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += secondsPerBeat;
    }

    schedule() {

        let n = 0; // limit n to 10 for now to prevent infinite loops
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (n < 10 && this.nextNoteTime < this.audioCtx.currentTime + SCHEDULEAHEADTIME) {
            n++;
            //this.scheduleNoteCallback(this.currentNote, this.nextNoteTime);
            this.nextNote();
        }

        this.timerId = window.setTimeout(this.schedule.bind(this), LOOKAHEAD);
    }
}
