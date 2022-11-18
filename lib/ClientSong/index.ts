import { SongFullDetails } from "../SongParser/types";
import { Timer } from "../Time";

type EventsMap = {
    "next-song": () => void;
}

export class SongsClient {
    private events: { [key in keyof EventsMap]?: EventsMap[key][] } = {}
    private interval: NodeJS.Timer | null = null;

    constructor(private songs: SongFullDetails[]) { }

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

    getWholeTimeInMS() {
        return this.songs.reduce((a, b) => a + b.info.duration, 0)
    }

    cleanup() {
        if (this.interval) clearInterval(this.interval)
    }

    getCurrentSong() {
        let offset = Timer.now().valueOf() % this.getWholeTimeInMS()

        for (let i = 0; i < this.songs.length; i++) {
            const song = this.songs[i]

            if (offset < song.info.duration) {
                return song
            }

            offset -= song.info.duration
        }

        return this.songs[0]
    }

    getCurrentSongTime() {
        let offset = Timer.now().valueOf() % this.getWholeTimeInMS()

        for (let i = 0; i < this.songs.length; i++) {
            const song = this.songs[i]

            if (offset < song.info.duration) {
                break
            }

            offset -= song.info.duration
        }

        return offset
    }

    getNextSong() {
        const currentSong = this.getCurrentSong()

        const index = this.songs.indexOf(currentSong)

        return this.songs[index >= this.songs.length ? 0 : index + 1]
    }

    getCurrentLyric(lyricsName: string) {
        const { lyrics } = this.getCurrentSong()
        const currentTime = this.getCurrentSongTime()
        const currentLyrics = lyrics.find(lyrics => lyrics.name = lyricsName) || lyrics[0]

        const currentTimeInMS = currentTime - currentLyrics.delay

        for (let i = 0; i < currentLyrics.lyrics.length; i++) {

            const current = currentLyrics.lyrics[i]
            const prev = currentLyrics.lyrics[i - 1]

            if (currentTimeInMS < current.startTime) {
                if (prev) {
                    return prev
                }

                return current
            } else if (currentTimeInMS === current.startTime) {
                return current
            }

            // last item
            if (i === currentLyrics.lyrics.length - 1 && currentTimeInMS >= current.startTime) {
                return current
            }
        }

        return currentLyrics.lyrics[0]
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