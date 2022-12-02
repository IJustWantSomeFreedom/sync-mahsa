import { createStyles, ScrollArea, Space, Text } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ClientSong } from '../../lib/ClientSong';
import { ParsedLyrics, SongLyric } from '../../lib/SongParser/types';

type StylesOptions = {
    viewportHeight: number;
}

const useStyles = createStyles((theme, { viewportHeight }: StylesOptions) => ({
    scrollAreaRoot: {
        width: typeof window !== "undefined" && document.body.scrollHeight <= viewportHeight && viewportHeight !== 0 ? "100%" : "max-content",
        textAlign: "center",
        height: "auto"
    }
}))

type LyricsProps = {
    client: ClientSong
}

const Lyrics: React.FC<LyricsProps> = ({ client }) => {
    const { height } = useViewportSize()
    const { classes, theme } = useStyles({ viewportHeight: height })
    const currentLyricRef = useRef<HTMLDivElement>(null)
    const viewport = useRef<HTMLDivElement>();

    const [lyric, setLyric] = useState<SongLyric>()
    const [lyrics, setLyrics] = useState<ParsedLyrics>(client.getLyrics())

    useEffect(() => {
        viewport.current?.scrollTo({ top: (currentLyricRef.current?.offsetTop || 0) - (viewport.current.clientHeight / 2), behavior: "smooth" })
    }, [lyric])

    useEffect(() => {
        const offLyric = client.events.on("lyric", (lyric) => {
            setLyric(lyric)
        })

        const offLyricsNameChange = client.events.on("lyrics-name-change", (lyrics) => {
            setLyrics(lyrics)
        })

        return () => {
            offLyric()
            offLyricsNameChange()
        }
    }, [client])

    return (
        <ScrollArea
            viewportRef={viewport as any}
            scrollbarSize={0}
            classNames={{ root: classes.scrollAreaRoot }}
            offsetScrollbars
        >
            <Space h={(viewport.current?.clientHeight || 0) * .4} />

            {
                useMemo(() => lyrics?.lyrics.map(({ key, lyric: lyricText, pronunciation }) => {
                    const isCurrent = lyric?.key === key

                    return (
                        <div key={key}>
                            {<Text
                                ref={isCurrent ? currentLyricRef : undefined}
                                weight={isCurrent ? "bold" : "normal"}
                                color={isCurrent ? (theme.colorScheme === "light" ? "dark" : "light") : "dimmed"}
                                sx={{ transition: ".3s", }}
                                size={isCurrent ? "lg" : "md"}
                                dir="auto"
                            >
                                {lyricText}
                            </Text>}
                            {<Text
                                weight={isCurrent ? "bold" : "normal"}
                                color={isCurrent ? (theme.colorScheme === "light" ? "dark" : "light") : "dimmed"}
                                sx={{ transition: ".3s", opacity: .5 }}
                                size={isCurrent ? "sm" : "xs"}
                                dir="auto"
                            >
                                {pronunciation}
                            </Text>}

                            <Space h="xs" />
                        </div>
                    )
                }), [theme.colorScheme, lyric?.key, lyrics?.lyrics])
            }

            <Space h={(viewport.current?.clientHeight || 0) * .4} />
        </ScrollArea>
    )
}

export default Lyrics