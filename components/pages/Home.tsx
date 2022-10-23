import { Container, SegmentedControl, Stack, Text, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { resetNavigationProgress, setNavigationProgress } from '@mantine/nprogress'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSong } from '../../hooks/song'
import { Songs } from '../../lib/SongLibrary'
import AudioToggleButton from '../AudioToggleButton'
import Lyrics from '../Lyrics'

const Home: React.FC<{ songs: Songs }> = (props) => {
    const [locale, setLocale] = useLocalStorage({
        key: "lyrics_locale",
        defaultValue: "Farsi",
    })

    const { currentSong: { name, info, lyrics, musics }, client } = useSong(props.songs)
    const [currentLyricKey, setCurrentLyricKey] = useState<string>()
  
    const sortedLocales = useMemo(() => Object.keys(lyrics).sort((a, b) => a.toLowerCase() === "farsi" ? -1 : ('' + a).localeCompare(b)), [lyrics])
    const getLocale = useCallback(() => locale in lyrics ? locale : "Farsi", [locale, lyrics])
    const currentLyrics = useMemo(() => lyrics[getLocale()], [getLocale, lyrics])
  
    const currentSongHandler = useCallback((currentTime: number) => {
      const currentTimeInMS = currentTime - currentLyrics.delay
  
      for (let i = 0; i < currentLyrics.lyrics.length; i++) {
  
        const current = currentLyrics.lyrics[i]
        const prev = currentLyrics.lyrics[i - 1]
  
        if (currentTimeInMS < current.startTime) {
          if (prev) {
            setCurrentLyricKey(prev.key)
          } else {
            setCurrentLyricKey(current.key)
          }
          break
        } else if (currentTimeInMS === current.startTime) {
          setCurrentLyricKey(current.key)
          break
        }
  
        // last item
        if (i === currentLyrics.lyrics.length - 1 && currentTimeInMS >= current.startTime) {
          setCurrentLyricKey(current.key)
        }
      }
    }, [currentLyrics.delay, currentLyrics.lyrics])
  
    useEffect(() => {
      const lyricsInterval = setInterval(() => {
        const currentTime = client.getCurrentSongTime()
        currentSongHandler(currentTime)
      }, 5)
  
      const progressBarInterval = setInterval(() => {
        const currentTime = client.getCurrentSongTime()
        setNavigationProgress(currentTime * 100 / info.duration)
      }, 50)
  
      return () => {
        clearInterval(lyricsInterval)
        clearInterval(progressBarInterval)
      }
    }, [client, currentLyrics.delay, currentLyrics.lyrics, currentSongHandler, info.duration])
  
    useEffect(() => {
      return () => {
        resetNavigationProgress()
      }
    }, [])
  
    return (
      <Container>
        <Stack align="center" justify="center" spacing="xl" pb="lg" sx={{ height: "calc(100vh - 7rem)", minHeight: "25rem" }}>
          <Stack align="center" spacing="sm">
            <Title sx={{ width: "100%" }} align="center">{info.name}</Title>
            <Text>Singer: {info.singer}</Text>
  
            {sortedLocales.length > 1 && <SegmentedControl
              onChange={setLocale}
              value={locale}
              data={sortedLocales}
            />}
  
          </Stack>
          <Lyrics currentLyricKey={currentLyricKey} lyrics={currentLyrics.lyrics} />
        </Stack>
  
        <AudioToggleButton
          dirName={name}
          musics={musics}
          getTime={() => client.getCurrentSongTime()}
        />
      </Container >
    )
  }

export default Home