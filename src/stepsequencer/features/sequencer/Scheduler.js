'use strict';

// Given a scheduleNoteCallback, use it to schedule note plays based on tempo
// code based on https://www.html5rocks.com/en/tutorials/audio/scheduling
export default class Scheduler {
    constructor(getTimeFromAudioCtx, getTempoFromState, getMaxNotesFromState, scheduleNoteCallback, updateNoteCallback) {
        this.isPlaying = false;
        this.currentNote = 0;
        this.nextNoteTime = 0.0;

        this.preciseTime = getTimeFromAudioCtx;
        this.tempo = getTempoFromState;
        this.maxNotes = getMaxNotesFromState;
        this.scheduleNoteCallback = scheduleNoteCallback;
        this.updateNoteCallback = updateNoteCallback;
    }

    playpause() {
        this.isPlaying = !this.isPlaying; // toggle isPlaying

        if (this.isPlaying) {
            this.nextNoteTime = this.preciseTime();

            this.schedule();
        } else {
            window.clearTimeout(this.timerId);
        }
    }

    // Advance note by incrementing currentNote and nextNoteTime
    // currentNote will wrap around at maxNotes
    nextNote() {
        // advance the step, wrapping around maxNotes
        this.currentNote = (this.currentNote + 1) % this.maxNotes();
        this.updateNoteCallback(this.currentNote); // update StepSequencer with the new note

        // update nextNoteTime
        const secondsPerBeat = 60.0 / this.tempo();
        this.nextNoteTime += secondsPerBeat;
    }

    schedule() {

        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (this.nextNoteTime < this.preciseTime() + SCHEDULEAHEADTIME) {
            this.scheduleNoteCallback(this.currentNote, this.nextNoteTime);
            this.nextNote();
        }

        this.timerId = window.setTimeout(this.schedule.bind(this), LOOKAHEAD);
    }
}
