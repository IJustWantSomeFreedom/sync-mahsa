import { ParsedLyrics, SongFullDetails, SongLyric } from "../SongParser/types";
import { Timer } from "../Time";
import { EventEmitter } from "./../EventEmitter";

type ClientSongEvents = {
  lyric: (lyric: SongLyric) => void;
  "song-change": (song: SongFullDetails) => void;
  "lyrics-name-change": (lyrics: ParsedLyrics) => void;
};

export class ClientSong {
  events = new EventEmitter<ClientSongEvents>();
  private _lyricsName: string = this.getCurrentSong().lyrics[0].name;

  constructor(public songs: SongFullDetails[]) {}

  getCurrentSong() {
    let offset = Timer.now().valueOf() % this.getWholeTimeInMS();

    for (let i = 0; i < this.songs.length; i++) {
      const song = this.songs[i];

      if (offset < song.info.duration) {
        return song;
      }

      offset -= song.info.duration;
    }

    return this.songs[0];
  }

  set lyricsName(name: string) {
    const { lyrics } = this.getCurrentSong();

    const prev = this._lyricsName;

    this._lyricsName = (
      lyrics.find((item) => item.name === name) || lyrics[0]
    ).name;

    if (this._lyricsName !== prev) {
      this.events.emit("lyrics-name-change", this.getLyrics());
    }
  }

  get lyricsName() {
    const { lyrics } = this.getCurrentSong();

    return (lyrics.find((item) => item.name === this._lyricsName) || lyrics[0])
      .name;
  }

  getLyrics() {
    const { lyrics } = this.getCurrentSong();

    return lyrics.find((item) => item.name === this.lyricsName)!;
  }

  listen() {
    let prevLyric: string | null = null;
    let prevSong: string | null = this.getCurrentSong().name;

    const interval = setInterval(() => {
      const lyric = this.getLyric();

      if (prevLyric !== lyric.key) {
        this.events.emit("lyric", lyric);
        prevLyric = lyric.key;
      }

      const song = this.getCurrentSong();
      if (prevSong !== song.name) {
        this.events.emit("song-change", song);
        prevSong = song.name;
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }

  getLyric() {
    const currentTime = this.getTime();
    const currentLyrics = this.getLyrics();

    const currentTimeInMS = currentTime - currentLyrics.delay;

    for (let i = 0; i < currentLyrics.lyrics.length; i++) {
      const current = currentLyrics.lyrics[i];
      const prev = currentLyrics.lyrics[i - 1];

      if (currentTimeInMS < current.startTime) {
        if (prev) {
          return prev;
        }

        return current;
      } else if (currentTimeInMS === current.startTime) {
        return current;
      }

      // last item
      if (
        i === currentLyrics.lyrics.length - 1 &&
        currentTimeInMS >= current.startTime
      ) {
        return current;
      }
    }

    return currentLyrics.lyrics[0];
  }

  getTime() {
    let offset = Timer.now().valueOf() % this.getWholeTimeInMS();

    for (let i = 0; i < this.songs.length; i++) {
      const song = this.songs[i];

      if (offset < song.info.duration) {
        break;
      }

      offset -= song.info.duration;
    }

    return offset;
  }

  private getWholeTimeInMS() {
    return this.songs.reduce((a, b) => a + b.info.duration, 0);
  }
}
