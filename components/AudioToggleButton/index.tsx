import React, { useState } from 'react'
import { IconVolume, IconVolumeOff } from '@tabler/icons';
import { Button, createStyles, keyframes, Popover, Text } from '@mantine/core';
import { useSongAudio, UseSongAudioOptions } from '../../hooks/songAudio';

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
  },
  dropdown: {
    marginLeft: 10,
  },
  arrow: {
    marginLeft: -10,
  },
}));

const AudioToggleButton: React.FC<UseSongAudioOptions> = ({ currentSongName, getTime, songs }) => {
  const { classes } = useStyles()
  const [shouldPopoverOpen, setShouldPopoverOpen] = useState(true)
  const { togglePlay, isPlaying } = useSongAudio({ currentSongName, getTime, songs })

  const clickHandler = () => {
    togglePlay()
    setShouldPopoverOpen(false)
  }

  return (
    <div className={classes.container}>
      <Popover
        width={200}
        classNames={{ dropdown: classes.dropdown, arrow: classes.arrow }}
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