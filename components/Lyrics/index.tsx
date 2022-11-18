import { createStyles, ScrollArea, Space, Text } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks';
import React, { useEffect, useMemo, useRef } from 'react'
import { SongLyric } from '../../lib/SongParser/types';

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
    currentLyricKey: string | undefined;
    lyrics: SongLyric[]
}

const Lyrics: React.FC<LyricsProps> = ({ currentLyricKey, lyrics }) => {
    const { height } = useViewportSize()
    const { classes, theme } = useStyles({ viewportHeight: height })
    const currentLyricRef = useRef<HTMLDivElement>(null)
    const viewport = useRef<HTMLDivElement>();

    useEffect(() => {
        viewport.current?.scrollTo({ top: (currentLyricRef.current?.offsetTop || 0) - (viewport.current.clientHeight / 2), behavior: "smooth" })
    }, [currentLyricKey])

    return (
        <ScrollArea
            viewportRef={viewport as any}
            scrollbarSize={0}
            classNames={{ root: classes.scrollAreaRoot }}
            offsetScrollbars
        >
            <Space h={(viewport.current?.clientHeight || 0) * .4} />

            {
                useMemo(() => lyrics.map(({ key, lyric, pronunciation }) => {
                    const isCurrent = currentLyricKey === key

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
                                {lyric}
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
                }), [lyrics, currentLyricKey, theme.colorScheme])
            }

            <Space h={(viewport.current?.clientHeight || 0) * .4} />
        </ScrollArea>
    )
}

export default Lyrics