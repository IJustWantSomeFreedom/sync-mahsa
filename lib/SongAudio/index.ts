import { Howl } from "howler";
import { CDN_URL, SONGS_PATH } from "../env";

export class SongAudio {
    public audio: Howl;
    private syncInterval?: NodeJS.Timer;
    public isLoaded = false

    constructor(public name: string, private getTime: () => number) {
        this.audio = new Howl({
            src: [CDN_URL, SONGS_PATH, name, "music.mp3"].join("/"),
            loop: true,
            html5: true
        })
    }

    async init() {
        if (!this.audio.playing()) {
            this.audio.play()
            this.audio.mute(true)
            this.audio.seek(0)
        }
    }

    play() {
        this.audio.mute(false)
        this.sync()

        clearInterval(this.syncInterval)

        const timeout = setTimeout(() => this.sync(), 1000)

        const interval = this.syncInterval = setInterval(() => {
            if (Math.abs((this.audio.seek() * 1000) - this.getTime()) >= 1000) {
                this.sync()
            }
        }, 1000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
            this.pause()
        }
    }

    pause() {
        this.audio.mute(true)
    }

    sync() {
        this.audio.seek(this.getTime() / 1000)
    }
}