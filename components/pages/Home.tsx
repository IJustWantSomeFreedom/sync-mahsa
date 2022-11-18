import { Container, SegmentedControl, Stack, Text, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { resetNavigationProgress, setNavigationProgress } from '@mantine/nprogress'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSong } from '../../hooks/song'
import { SongFullDetails } from '../../lib/SongParser/types'
import AudioToggleButton from '../AudioToggleButton'
import Lyrics from '../Lyrics'

const Home: React.FC<{ songs: SongFullDetails[] }> = (props) => {
  const [lyricsName, setLyricsName] = useLocalStorage({
    key: "preferred_lyrics_name",
    defaultValue: "Farsi",
  })

  const { currentSong: { name, info, lyrics }, client } = useSong(props.songs)
  const [currentLyricKey, setCurrentLyricKey] = useState<string>()

  const sortedLyricsName = useMemo(() => lyrics.map(a => a.name).sort((a, b) => a.toLowerCase() === "farsi" ? -1 : a.localeCompare(b)), [lyrics])
  const preferredLyricsName = useMemo(() => lyricsName in lyrics ? lyricsName : "Farsi", [lyricsName, lyrics])
  const currentLyrics = useMemo(() => lyrics.find(item => item.name === preferredLyricsName) || lyrics[0], [preferredLyricsName, lyrics])

  const currentLyricHandler = useCallback(() => {
    const currentLyric = client.getCurrentLyric(currentLyrics.name)

    setCurrentLyricKey(currentLyric.key)
  }, [client, currentLyrics.name])

  useEffect(() => {
    const lyricsInterval = setInterval(() => {
      currentLyricHandler()
    }, 5)

    const progressBarInterval = setInterval(() => {
      const currentTime = client.getCurrentSongTime()
      setNavigationProgress(currentTime * 100 / info.duration)
    }, 50)

    return () => {
      clearInterval(lyricsInterval)
      clearInterval(progressBarInterval)
    }
  }, [client, currentLyrics.delay, currentLyrics.lyrics, currentLyricHandler, info.duration])

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

          {sortedLyricsName.length > 1 && <SegmentedControl
            onChange={setLyricsName}
            value={preferredLyricsName}
            data={sortedLyricsName}
          />}

        </Stack>
        <Lyrics currentLyricKey={currentLyricKey} lyrics={currentLyrics.lyrics} />
      </Stack>

      <AudioToggleButton
        currentSongName={name}
        getTime={() => client.getCurrentSongTime()}
        songs={props.songs}
      />
    </Container >
  )
}

export default Home