import fs from "fs"
import path from "path";
import { Info, LyricsFile, ParsedLyrics, ParsedLyricsFile, SongFullDetails, SongLyric } from "./types";

type SongSingleParserOptions = {
    path: string;
}

export class SongParser {
    static async getAll(options: SongSingleParserOptions): Promise<SongFullDetails[]> {
        const dirs = await fs.promises.readdir(options.path)

        const songs = await Promise.all(dirs.map(async name => {
            const song = new SongParser({ path: path.join(options.path, name) })

            const info = await song.getInfo()
            const lyrics = await song.getLyricsData()

            return { info, lyrics, name }
        }))

        // sort it to guarantee the order of songs and synchronization
        const sortedSongs = songs.sort((a, b) => ('' + a.name).localeCompare(b.name))

        return sortedSongs
    }

    constructor(private options: SongSingleParserOptions) { }

    getMusic() {
        return fs.promises.readFile(path.join(this.options.path, "music.mp3"))
    }

    async getLyricsData(): Promise<ParsedLyrics[]> {
        const dir = await fs.promises.readdir(this.options.path)

        const lyricsFilesName = dir.filter(fileName => fileName.endsWith(".lyrics.json"))

        const filesData = await Promise.all(lyricsFilesName.map(async lyricsFileName => {
            const [name] = lyricsFileName.split(".")

            const filePath = path.join(this.options.path, lyricsFileName)

            const data = await fs.promises.readFile(filePath, {
                encoding: "utf8"
            })

            if (!data) throw new Error(`file ${filePath} cannot be empty`)

            return {
                name,
                ...this.parseLyrics(JSON.parse(data))
            }
        }))

        return filesData
    }

    private parseLyrics(data: LyricsFile): ParsedLyricsFile {
        const { delay, lyrics } = data

        const parsedLyrics = Object.entries(lyrics).map<SongLyric>(([key, value]) => {
            const [m, s, ms] = key.split(":").map(n => +n)

            let lyric: string | {
                lyric: string,
                pronunciation: string
            } = value

            if (typeof value === "string") {
                if (!value) throw new Error("Lyric value cannot be empty")

                lyric = {
                    lyric: value,
                    pronunciation: ""
                }
            } else {
                const { lyric: _lyric, pronunciation } = value

                if (!_lyric) throw new Error("Lyric value cannot be empty")

                lyric = {
                    lyric: _lyric,
                    pronunciation: pronunciation || ""
                }
            }

            return {
                lyric: typeof lyric === "string" ? lyric : lyric.lyric,
                pronunciation: typeof lyric === "string" ? "" : lyric.pronunciation,
                key,
                startTime: (m * 60_000) + (s * 1000) + ms
            }
        }).sort((a, b) => a.startTime - b.startTime)

        return {
            delay,
            lyrics: parsedLyrics
        }
    }

    async getInfo(): Promise<Info> {
        const filePath = path.join(this.options.path, "info.json")

        const infoFileData = await fs.promises.readFile(filePath, {
            encoding: "utf8"
        })

        if (!infoFileData) {
            throw new Error(`file ${filePath} cannot be empty`)
        }

        return JSON.parse(infoFileData)
    }
}