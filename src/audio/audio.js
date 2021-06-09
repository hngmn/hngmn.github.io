window.onload = function() {

    const AudioContext = window.AudioContext || window.webkitAudioContext
    var audioContext = new AudioContext();

    const audioElement = document.querySelector('audio');
    const track = audioContext.createMediaElementSource(audioElement);

    const playButton = document.querySelector('button');

    // play/pause callback
    playButton.addEventListener('click', function() {

        // check if context is in suspended state (autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // play or pause track depending on state
        if (this.dataset.playing === 'false') {
            audioElement.play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            this.dataset.playing = 'false';
        }

    }, false);

    // handle end of sound
    audioElement.addEventListener('ended', function() {
        playButton.dataset.playing = 'false';
    }, false);

    // start modifying sound
    const gainNode = audioContext.createGain();

    const volumeControl = document.querySelector('#volume');

    volumeControl.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    }, false);

    // wire audio graph
    track.connect(gainNode).connect(audioContext.destination);
};
