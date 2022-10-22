import React, { useEffect, useRef, useState, useMemo } from 'react'
import { IconArrowNarrowDown, IconChevronDown, IconVolume, IconVolumeOff } from '@tabler/icons';
import { Button, createStyles, keyframes, Popover, Text } from '@mantine/core';
import { BASE_SONGS_URL } from '../../lib/env';
import mime from "mime/lite"

const bounce = keyframes({
  'from': { transform: 'translate(-50%, 0)' },
  'to': { transform: 'translate(-50%, .5rem)' },
});

const useStyles = createStyles(theme => ({
  container: {
    position: "fixed",
    left: "1rem",
    bottom: "1rem",
  },
  flash: {
    height: "50vh",
    width: ".2rem",
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.blue[5],
    display: "block",
    position: "absolute",
    bottom: "150%",
    left: "50%",
    transform: "translate(-50%)",
    animation: `${bounce} 1s ease-in-out infinite alternate`,
  },
  icon: {
    color: theme.colors.blue[5],
    position: "absolute",
    bottom: 0,
    left: "50%",
    strokeWidth: ".1rem",
    transform: "translate(-50%, 40%)"
  },
  text: {
    writingMode: "vertical-lr",
  }
}));

type AudioToggleButtonProps = {
  musics: Record<string, string>;
  dirName: string;
  getTime: () => number;
}

const AudioToggleButton: React.FC<AudioToggleButtonProps> = ({ dirName, musics, getTime }) => {
  const { classes } = useStyles()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>() as unknown as React.MutableRefObject<HTMLAudioElement>
  const [shouldPopoverOpen, setShouldPopoverOpen] = useState(true)
  const [key, setKey] = useState(1)
  const playTimeoutRef = useRef<NodeJS.Timeout>()

  const getTimeRef = useRef(getTime)

  const balanceAudioTime = () => {
    audioRef.current.currentTime = getTimeRef.current() / 1000
  }

  useEffect(() => {
    const audio = audioRef.current

    if (isPlaying) {
      audio.play();

      audio.volume = 1

      const interval = setInterval(() => {
        if (Math.abs((audio.currentTime * 1000) - getTimeRef.current()) >= 1000) {
          balanceAudioTime()
        }
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, key])

  useEffect(() => {
    setKey(Math.random())
  }, [dirName])

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    setIsPlaying(prev => !prev)
    setShouldPopoverOpen(false)
  }

  const playHandler = () => {
    clearTimeout(playTimeoutRef.current)
    
    balanceAudioTime()
    
    playTimeoutRef.current = setTimeout(balanceAudioTime, 1000)
  }

  return (
    <div className={classes.container}>
      <Popover
        width={200}
        styles={{
          dropdown: {
            marginLeft: 10,
          },
          arrow: {
            marginLeft: -10,
          },
        }}
        onClose={() => setShouldPopoverOpen(false)}
        opened={shouldPopoverOpen}
        position="bottom"
        shadow="md"
        withArrow
        closeOnClickOutside={false}
      >
        <Popover.Target>
          <Button variant='subtle' onClick={clickHandler}>
            <audio
              onPlay={playHandler}
              ref={audioRef}
              controlsList="nodownload"
              controls
              hidden
              key={key}
            >
              {useMemo(() => Object.entries(musics).map(([key, value]) => (
                <source key={key} src={`${BASE_SONGS_URL}/${dirName}/${value}`} type={mime.getType(value)!} />
              )), [musics, dirName])}
            </audio>
            {isPlaying ? <IconVolume /> : <IconVolumeOff />}
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm">You can click on the button below to listen to the song</Text>
        </Popover.Dropdown>
      </Popover>
    </div>
  )
}

export default AudioToggleButton