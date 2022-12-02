import { Container, SegmentedControl, Stack, Text, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { resetNavigationProgress, setNavigationProgress } from '@mantine/nprogress'
import React, { useEffect, useMemo } from 'react'
import { useSong } from '../../hooks/song'
import { SongFullDetails } from '../../lib/SongParser/types'
import AudioToggleButton from '../AudioToggleButton'
import Lyrics from '../Lyrics'

const Home: React.FC<{ songs: SongFullDetails[] }> = (props) => {
  const [lyricsName, setLyricsName] = useLocalStorage({
    key: "preferred_lyrics_name",
    defaultValue: "Farsi",
  })

  const { currentSong: { info, lyrics }, client, audio } = useSong(props.songs)

  const sortedLyricsName = useMemo(() => lyrics.map(a => a.name).sort((a, b) => a.toLowerCase() === "farsi" ? -1 : a.localeCompare(b)), [lyrics])
  const preferredLyricsName = useMemo(() => lyrics.some(lyric => lyric.name === lyricsName) ? lyricsName : "Farsi", [lyricsName, lyrics])

  useEffect(() => {
    const progressBarInterval = setInterval(() => {
      const currentTime = client.getTime()
      setNavigationProgress(currentTime * 100 / info.duration)
    }, 50)

    return () => {
      clearInterval(progressBarInterval)
    }
  }, [client, info.duration])

  useEffect(() => {
    client.lyricsName = preferredLyricsName
  }, [preferredLyricsName, client])

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
        <Lyrics client={client} />
      </Stack>

      <AudioToggleButton
        audio={audio}
      />
    </Container >
  )
}

export default Home