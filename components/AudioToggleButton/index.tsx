import React, { useEffect, useRef, useState } from 'react'
import { IconVolume, IconVolumeOff } from '@tabler/icons';
import { Button, createStyles, keyframes, Popover, Text } from '@mantine/core';
import { CDN_URL, SONGS_PATH } from '../../lib/env';
import { Songs } from '../../lib/SongLibrary';
import { EventEmitter } from '../../lib/EventEmitter';
import { Howl } from 'howler';

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

type SongAudioEvents = {
  load: () => void;
  cleanup: () => void;
}

class SongAudio {
  public audio: Howl;
  private syncInterval?: NodeJS.Timer;
  public isLoaded = false
  private isLoading = false
  private events = new EventEmitter<SongAudioEvents>()

  constructor(public name: string, private getTime: () => number) {
    this.audio = new Howl({
      src: [CDN_URL, SONGS_PATH, name, "music.mp3"].join("/"),
      loop: true,
      html5: true
    })
  }

  async init() {
    if (!this.audio.playing()) {
      this.audio.play()
      this.audio.mute(true)
      this.audio.seek(0)
    }
  }

  play() {
    this.audio.mute(false)
    this.sync()

    clearInterval(this.syncInterval)

    const timeout = setTimeout(() => this.sync(), 1000)

    const interval = this.syncInterval = setInterval(() => {
      if (Math.abs((this.audio.seek() * 1000) - this.getTime()) >= 1000) {
        this.sync()
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      this.pause()
    }
  }

  pause() {
    this.audio.mute(true)
  }

  sync() {
    this.audio.seek(this.getTime() / 1000)
  }
}

const AudioToggleButton: React.FC<AudioToggleButtonProps> = ({ dirName, musics, getTime, songs }) => {
  const { classes } = useStyles()
  const [isPlaying, setIsPlaying] = useState(false)
  const [shouldPopoverOpen, setShouldPopoverOpen] = useState(true)
  const audiosRef = useRef<SongAudio[]>([])
  const getTimeRef = useRef(getTime)

  const clickHandler = () => {
    setIsPlaying(prev => !prev)
    setShouldPopoverOpen(false)
  }

  useEffect(() => {
    const audios = audiosRef.current = songs.songs.map(song => new SongAudio(song.name, getTimeRef.current))

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

      const currentAudio = audiosRef.current.find(audio => audio.name === dirName)

      if (!currentAudio) return;

      const cleanup = currentAudio.play()

      return () => {
        cleanup()
      }
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