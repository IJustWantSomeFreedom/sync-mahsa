import { useCallback, useEffect, useRef, useState } from "react"
import { SongAudio } from "../lib/SongAudio"
import { SongFullDetails } from "../lib/SongParser/types";

export type UseSongAudioOptions = {
    currentSongName: string;
    getTime: () => number;
    songs: SongFullDetails[];
}

export const useSongAudio = ({ currentSongName, getTime, songs }: UseSongAudioOptions) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const audiosRef = useRef<SongAudio[]>([])
    const getTimeRef = useRef(getTime)

    const togglePlay = useCallback(() => {
        setIsPlaying(prev => !prev)
    }, [])

    const play = useCallback(() => {
        setIsPlaying(true)
    }, [])

    const pause = useCallback(() => {
        setIsPlaying(false)
    }, [])

    useEffect(() => {
        const audios = audiosRef.current = songs.map(song => new SongAudio(song.name, getTimeRef.current))

        return () => {
            audios.map(audio => audio.pause())
        }
    }, [songs])

    useEffect(() => {
        audiosRef.current.forEach(audio => {
            audio.pause()
        })

        if (isPlaying) {
            audiosRef.current.forEach(audio => {
                audio.init()
            })

            const currentAudio = audiosRef.current.find(audio => audio.name === currentSongName)

            if (!currentAudio) return;

            const cleanup = currentAudio.play()

            return () => {
                cleanup()
            }
        }
    }, [isPlaying, currentSongName])

    return {
        togglePlay,
        play,
        pause,
        isPlaying
    }
}