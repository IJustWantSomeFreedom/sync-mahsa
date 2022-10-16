import { useState, useEffect } from "react"
import { SongsClient } from "../lib/ClientSong"
import { SongDetails, Songs } from "../lib/SongLibrary"

export const useSong = (songDetails: Songs) => {
    const [client] = useState(() => new SongsClient(songDetails))
    const [currentSong, setCurrentSong] = useState<SongDetails>(client.getCurrentSong())

    useEffect(() => {
        client.listen()
        const off = client.on("next-song", () => {
            const current = client.getCurrentSong()
            setCurrentSong(current)
        })

        return () => {
            off()
            client.cleanup()
        }
    }, [client])

    return { client, currentSong }
}
