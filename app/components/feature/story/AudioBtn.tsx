import React, { useCallback, useEffect, useRef, useState } from 'react';

import logger from '../../../utils/logger.util';
import { createSound } from 'react-native-nitro-sound';
import { toMmSs, toMmSsSS } from '../../../utils/time-formatter.util.ts';
import { VoicePlayButton } from '../voice/VoicePlayButton';

import { useStoryStore } from '../../../stores/story.store';

type AudioBtnProps = {
  audioUrl?: string;
  disabled?: boolean;
  onPlay: () => void;
};
export const AudioBtn = ({
  audioUrl,
  disabled,
  onPlay,
}: AudioBtnProps): React.ReactElement => {
  const setPlayInfo = useStoryStore(state => state.setPlayInfo);
  const soundRef = useRef<ReturnType<typeof createSound> | null>(null);
  const listenersAttached = useRef<boolean>(false);
  const [currTime, setCurrTime] = useState<number>();
  const [durationTime, setDurationTime] = useState<number>();
  const [isPlaying, setPlaying] = useState<boolean>(false);

  const attachListeners = useCallback(() => {
    if (listenersAttached.current) {
      return;
    }
    try {
      const sound = soundRef.current ?? createSound();
      soundRef.current = sound;

      sound.addPlayBackListener(event => {
        const currentSeconds = event.currentPosition / 1000;
        const durationSeconds = event.duration / 1000;

        setCurrTime(currentSeconds);
        setDurationTime(durationSeconds);
        setPlayInfo({
          currentPositionSec: currentSeconds,
          currentDurationSec: durationSeconds,
          playTime: toMmSs(currentSeconds ?? 0),
          duration: toMmSs(durationSeconds ?? 0),
          isPlay: true,
        });
      });

      sound.addPlaybackEndListener(event => {
        setPlaying(false);
        const currentSeconds = event.currentPosition / 1000;
        const durationSeconds = event.duration / 1000;
        setCurrTime(currentSeconds);
        setDurationTime(durationSeconds);
        setPlayInfo({
          currentPositionSec: currentSeconds,
          currentDurationSec: durationSeconds,
          playTime: toMmSs(currentSeconds ?? 0),
          duration: toMmSs(durationSeconds ?? 0),
          isPlay: false,
        });
      });

      listenersAttached.current = true;
    } catch (error) {}
  }, [setPlayInfo]);

  const ensureSound = useCallback(() => {
    if (!soundRef.current) {
      soundRef.current = createSound();
    }
    attachListeners();
    return soundRef.current;
  }, [attachListeners]);

  useEffect(() => {
    return () => {
      try {
        soundRef.current?.stopPlayer();
        soundRef.current?.removePlayBackListener();
        soundRef.current?.removePlaybackEndListener();
        // dispose is available on Nitro HybridObjects
        (soundRef.current as any)?.dispose?.();
      } catch (error) {
      } finally {
        soundRef.current = null;
        listenersAttached.current = false;
      }
    };
  }, []);

  useEffect(() => {
    setPlaying(false);
    setCurrTime(undefined);
    setDurationTime(undefined);
    try {
      soundRef.current?.stopPlayer();
      soundRef.current?.removePlayBackListener();
      soundRef.current?.removePlaybackEndListener();
    } catch (error) {
    } finally {
      listenersAttached.current = false;
    }
  }, [audioUrl]);

  const onPress = async () => {
    if (disabled) {
      return;
    }
    try {
      setPlayInfo({
        currentDurationSec: durationTime,
        duration: toMmSsSS(durationTime ?? 0),
      });
      const sound = ensureSound();
      if (!audioUrl) {
        return;
      }
      await sound.stopPlayer();
      await sound.startPlayer(audioUrl);
      setPlaying(true);
      onPlay && onPlay();
    } catch (e) {
      setPlaying(false);
      logger.debug('Audio play error:', e);
    }
  };

  if (!audioUrl) {
    return <></>;
  }

  return (
    <VoicePlayButton
      onPress={onPress}
      playDurationText={
        isPlaying ? toMmSs(currTime ?? 0) : toMmSs(durationTime ?? 0)
      }
    />
  );
};
