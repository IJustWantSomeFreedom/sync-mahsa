import { useCallback, useEffect, useRef, useState } from "react";
import { ClientSong } from "../lib/ClientSong";
import { SongAudio } from "../lib/SongAudio";

export type UseSongAudioOptions = {
  client: ClientSong;
};

export const useSongAudio = ({ client }: UseSongAudioOptions) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audiosRef = useRef<SongAudio[]>([]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    const audios = (audiosRef.current = client.songs.map(
      (song) => new SongAudio(song.name, () => client.getTime())
    ));

    return () => {
      audios.map((audio) => audio.pause());
    };
  }, [client]);

  useEffect(() => {
    audiosRef.current.forEach((audio) => {
      audio.pause();
    });

    if (isPlaying) {
      audiosRef.current.forEach((audio) => {
        audio.init();
      });

      const currentAudio = audiosRef.current.find(
        (audio) => audio.name === client.getCurrentSong().name
      );

      if (!currentAudio) return;

      const cleanup = currentAudio.play();

      return () => {
        cleanup();
      };
    }
  }, [isPlaying, client]);

  return {
    togglePlay,
    play,
    pause,
    isPlaying,
  };
};
