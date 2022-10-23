import { ScrollArea, Space, Text, useMantineTheme } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks';
import React, { useEffect, useMemo, useRef } from 'react'
import { SongLyric } from '../../lib/SongLibrary'

type LyricsProps = {
    currentLyricKey: string | undefined;
    lyrics: SongLyric[]
}

const Lyrics: React.FC<LyricsProps> = ({ currentLyricKey, lyrics }) => {
    const theme = useMantineTheme()
    const currentLyricRef = useRef<HTMLDivElement>()
    const viewport = useRef<HTMLDivElement>();
    const { height } = useViewportSize()

    useEffect(() => {
        viewport.current?.scrollTo({ top: (currentLyricRef.current?.offsetTop || 0) - (viewport.current.clientHeight / 2), behavior: "smooth" })
    }, [currentLyricKey])

    return (
        <ScrollArea
            viewportRef={viewport as any}
            scrollbarSize={0}
            sx={{
                width: typeof window !== "undefined" && document.body.scrollHeight <= height && height !== 0 ? "100%" : "max-content",
                textAlign: "center",
                height: "auto"
            }}
            offsetScrollbars
        >
            <Space h={(viewport.current?.clientHeight || 0) * .4} />

            {
                useMemo(() => lyrics.map(({ key, lyric, pronunciation }) => {
                    const isCurrent = currentLyricKey === key

                    return (
                        <div
                            key={key}
                        >
                            {<Text
                                ref={isCurrent ? currentLyricRef as any : undefined}
                                weight={isCurrent ? "bold" : "normal"}
                                color={isCurrent ? (theme.colorScheme === "light" ? "dark" : "light") : "dimmed"}
                                sx={{ transition: ".3s", }}
                                size={isCurrent ? "lg" : "md"}
                                dir="auto"
                            >
                                {lyric}
                            </Text>}
                            {<Text
                                ref={isCurrent ? currentLyricRef as any : undefined}
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
                }), [lyrics, currentLyricKey, theme.colorScheme])
            }

            <Space h={(viewport.current?.clientHeight || 0) * .4} />
        </ScrollArea>
    )
}

export default Lyrics