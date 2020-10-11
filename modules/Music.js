class Music {
    constructor(path, type) {
        const audio = new Audio();
        audio.src = path;
        audio.type = type || 'audio/mp3';
        audio.loop = true;

        this.audio = audio;
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }
}

export default Music;
