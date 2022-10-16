import path from "path"
import fs from "fs"
import { SONGS_PATH } from "../env";

export type SongInfo = {
    name: string;
    singer: string;
    duration: number;
}

export type SongLyric = {
    key: string;
    startTime: number;
    lyric: string;
}

export type SongLyrics = {
    delay: number;
    lyrics: SongLyric[];
}

export type SongDetails = {
    lyrics: Record<string, SongLyrics>
    musics: Record<string, string>;
    info: SongInfo;
    name: string;
}

export type Songs = {
    wholeTimeInMS: number;
    songs: SongDetails[]
}

export class SongLibrary {
    static instance: SongLibrary;

    static getInstance() {
        return SongLibrary.instance ||= new SongLibrary()
    }

    private constructor() { }

    async getSongs(): Promise<Songs> {
        const dirs = await fs.promises.readdir(SONGS_PATH)


        const songs = await Promise.all(dirs.map<Promise<SongDetails>>(async dir => {
            const files = await fs.promises.readdir(path.join(process.cwd(), SONGS_PATH, dir))

            let info: SongInfo | undefined = undefined;
            const musics: Record<string, string> = {}
            const lyrics: Record<string, SongLyrics> = {}

            // add info and lyrics datas
            await Promise.all(files.map(async file => {
                const readFile = () => fs.promises.readFile(path.join(process.cwd(), SONGS_PATH, dir, file), { encoding: "utf8" })

                if (file.startsWith("music.")) {
                    musics[file.split(".")[1]] = file
                    return
                }

                if (file.startsWith("info.")) {
                    info = JSON.parse(await readFile())
                    return
                }

                if (file.endsWith(".lyrics.json")) {
                    const unJsonLyrics = JSON.parse(await readFile())

                    unJsonLyrics.lyrics = this.parseLyrics(unJsonLyrics.lyrics)

                    lyrics[file.split(".")[0]] = unJsonLyrics
                    return
                }
            }))

            if (!info) {
                throw new Error(`info.json is not created for song "${dir}"`)
            }


            return {
                musics,
                info: info as SongInfo,
                lyrics,
                name: dir,
            }
        }))

        // sort it to guarantee the order of songs and synchronization
        songs.sort((a, b) => ('' + a.name).localeCompare(b.name))

        const wholeTimeInMS = songs.reduce((a, b) => a + b.info.duration, 0)

        return {
            songs,
            wholeTimeInMS,
        }
    }

    private parseLyrics(lyrics: Record<string, string>) {
        return Object.entries(lyrics).map(([key, value]) => {
            const [m, s, ms] = key.split(":").map(n => +n)

            return {
                lyric: value,
                key,
                startTime: (m * 60_000) + (s * 1000) + ms
            }
        }).sort((a, b) => a.startTime - b.startTime)
    }
}