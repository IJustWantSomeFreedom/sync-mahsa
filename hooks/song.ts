import { useState, useEffect } from "react";
import { ClientSong } from "../lib/ClientSong";
import { SongFullDetails } from "../lib/SongParser/types";
import { useSongAudio } from "./songAudio";

export const useSong = (songDetails: SongFullDetails[]) => {
  const [client, setClient] = useState(() => new ClientSong(songDetails));
  const audio = useSongAudio({ client });

  useEffect(() => {
    const cleanup = client.listen();
    const off = client.events.on("song-change", () => {
      setClient(new ClientSong(songDetails));
    });

    return () => {
      off();
      cleanup();
    };
  }, [client, songDetails]);

  const currentSong = client.getCurrentSong();

  return { client, currentSong, audio };
};
