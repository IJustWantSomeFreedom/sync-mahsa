import { SongDetails, Songs } from "../SongLibrary";
import { Timer } from "../Time";

type EventsMap = {
    "next-song": () => void;
}

export class SongsClient {
    private events: { [key in keyof EventsMap]?: EventsMap[key][] } = {}
    private interval: NodeJS.Timer | null = null;

    constructor(private songs: Songs) { }

    listen() {
        let prev = this.getCurrentSong()

        this.interval = setInterval(() => {
            const current = this.getCurrentSong()

            if (prev.name !== current.name) {
                this.emit("next-song")
            }

            prev = current
        }, 5)
    }

    cleanup() {
        if (this.interval) clearInterval(this.interval)
    }

    getCurrentSong() {
        let offset = Timer.now().valueOf() % this.songs.wholeTimeInMS

        for (let i = 0; i < this.songs.songs.length; i++) {
            const song = this.songs.songs[i]

            if (offset < song.info.duration) {
                return song
            }

            offset -= song.info.duration
        }

        return this.songs.songs[0]
    }

    getCurrentSongTime() {
        let offset = Timer.now().valueOf() % this.songs.wholeTimeInMS

        for (let i = 0; i < this.songs.songs.length; i++) {
            const song = this.songs.songs[i]

            if (offset < song.info.duration) {
                break
            }

            offset -= song.info.duration
        }

        return offset
    }

    getNextSong() {
        const currentSong = this.getCurrentSong()

        const index = this.songs.songs.indexOf(currentSong)

        return this.songs.songs[index >= this.songs.songs.length ? 0 : index + 1]
    }

    on<TEvent extends keyof EventsMap>(event: TEvent, callback: EventsMap[TEvent]) {
        this.events[event] ||= []
        this.events[event]?.push(callback)

        return () => this.off(event, callback)
    }

    off<TEvent extends keyof EventsMap>(event: TEvent, callback: EventsMap[TEvent]) {
        const index = this.events[event]?.indexOf(callback)

        if (typeof index === "number" && index > -1) {
            this.events[event]?.splice(index, 1)
        }
    }

    private emit<TEvent extends keyof EventsMap>(event: TEvent, ...args: Parameters<EventsMap[TEvent]>) {
        this.events[event]?.forEach(cb => {
            (cb as any)(...args)
        })
    }
}