import React, { useEffect, useRef, useState, useMemo } from 'react'
import { IconVolume, IconVolumeOff } from '@tabler/icons';
import { Button, createStyles, keyframes, Popover, Text } from '@mantine/core';
import { CDN_URL, SONGS_PATH } from '../../lib/env';
import mime from "mime/lite"
import { showNotification } from '@mantine/notifications';
import { Songs } from '../../lib/SongLibrary';

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
  songs: Songs;
}

class SongAudio {
  private audio: HTMLAudioElement;
  private cleanups: (() => void)[] = [];
  private syncInterval?: NodeJS.Timer;

  constructor(public name: string, private getTime: () => number) {
    this.audio = new Audio([CDN_URL, SONGS_PATH, name, "music.mp3"].join("/"))
  }

  async load() {
    const listener = () => {
      Promise.resolve()
      this.audio.removeEventListener("canplaythrough", listener)
    }

    this.audio.addEventListener("canplaythrough", listener)

    this.cleanups.push(() => {
      this.audio.removeEventListener("canplaythrough", listener)
    })

    this.audio.load()
  }

  play() {
    this.audio.play()
    this.audio.volume = 1
    this.sync()

    clearInterval(this.syncInterval)

    const interval = this.syncInterval = setInterval(() => {
      if (Math.abs((this.audio.currentTime * 1000) - this.getTime()) >= 1000) {
        this.sync()
      }
    }, 1000)

    this.cleanups.push(() => {
      clearInterval(interval)
      this.pause()
    })
  }

  pause() {
    this.audio.pause()
  }

  sync() {
    this.audio.currentTime = this.getTime() / 1000
  }

  cleanup() {
    this.cleanups.forEach(cleanupFn => cleanupFn())
  }
}

const AudioToggleButton: React.FC<AudioToggleButtonProps> = ({ dirName, musics, getTime, songs }) => {
  const { classes } = useStyles()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>() as unknown as React.MutableRefObject<HTMLAudioElement>
  const [shouldPopoverOpen, setShouldPopoverOpen] = useState(true)
  const playTimeoutRef = useRef<NodeJS.Timeout>()

  const getTimeRef = useRef(getTime)

  const balanceAudioTime = () => {
    audioRef.current.currentTime = getTimeRef.current() / 1000
  }

  // useEffect(() => {
  //   const audio = audioRef.current

  //   if (isPlaying) {
  //     audio.currentTime = 0

  //     audio.pause()

  //     const listener = () => {
  //       audio.play()
  //       audio.removeEventListener("canplaythrough", listener)
  //     }

  //     audio.addEventListener("canplaythrough", listener)
  //     audio.load()

  //     audio.volume = 1

  //     const interval = setInterval(() => {
  //       if (Math.abs((audio.currentTime * 1000) - getTimeRef.current()) >= 1000) {
  //         balanceAudioTime()
  //       }
  //     }, 1000)

  //     return () => {
  //       clearInterval(interval)
  //       audio.removeEventListener("canplaythrough", listener)
  //     }
  //   } else {
  //     audio.pause();
  //   }
  // }, [isPlaying, dirName])

  const clickHandler = () => {
    setIsPlaying(prev => !prev)
    setShouldPopoverOpen(false)
  }

  const playHandler = () => {
    clearTimeout(playTimeoutRef.current)

    balanceAudioTime()

    playTimeoutRef.current = setTimeout(balanceAudioTime, 1000)
  }

  const audiosRef = useRef<SongAudio[]>([])

  useEffect(() => {
    const audios = audiosRef.current = songs.songs.map(song => new SongAudio(song.name, getTimeRef.current))

    audios.forEach(audio => audio.load())

    return () => {
      audios.forEach(audio => audio.cleanup())
    }
  }, [songs])

  useEffect(() => {
    const audio = audiosRef.current.find(audio => audio.name === dirName)

    if (!audio) return;

    audiosRef.current.forEach(audio => audio.pause())

    if (isPlaying) {
      audio.play()
    }
  }, [isPlaying, dirName])

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