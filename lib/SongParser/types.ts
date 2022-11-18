export type LyricsFile = {
    delay: number;
    lyrics: Record<string, string | {
        lyric: string;
        pronunciation: string;
    }>
}

export type SongLyric = {
    key: string;
    startTime: number;
    lyric: string;
    pronunciation: string;
}

export type ParsedLyricsFile = {
    delay: number;
    lyrics: SongLyric[]
}

export type ParsedLyrics = ParsedLyricsFile & {
    name: string
}

export type Info = {
    name: string;
    singer: string;
    duration: number;
}

export type SongFullDetails = {
    info: Info;
    name: string;
    lyrics: ParsedLyrics[]
}