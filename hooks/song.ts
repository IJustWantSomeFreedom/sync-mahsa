import { useState, useEffect } from "react"
import { SongsClient } from "../lib/ClientSong"
import { SongFullDetails } from "../lib/SongParser/types"

export const useSong = (songDetails: SongFullDetails[]) => {
    const [client] = useState(() => new SongsClient(songDetails))
    const [currentSong, setCurrentSong] = useState<SongFullDetails>(client.getCurrentSong())

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
