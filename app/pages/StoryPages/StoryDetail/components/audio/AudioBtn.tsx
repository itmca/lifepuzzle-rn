import React, { useCallback, useEffect, useRef, useState } from 'react';

import { logger } from '../../../../../utils/logger.util';
import { createSound } from 'react-native-nitro-sound';
import { toMmSs } from '../../../../../utils/time-formatter.util.ts';
import { VoicePlayButton } from './VoicePlayButton';

type AudioBtnProps = {
  audioUrl?: string;
  audioDuration?: number;
  disabled?: boolean;
  onPlay: () => void;
};

/**
 * 기존에 저장된 음성을 재생하는 버튼 컴포넌트
 *
 * @description
 * - createSound() 인스턴스를 사용하여 음성 재생
 * - 로컬 상태만 관리 (전역 playInfo 사용 안 함)
 * - VoiceRecorder(녹음/재생)와 독립적으로 동작
 */
export const AudioBtn = ({
  audioUrl,
  audioDuration,
  disabled,
  onPlay,
}: AudioBtnProps): React.ReactElement => {
  // Local state only (전역 상태 사용 안 함)
  const soundRef = useRef<ReturnType<typeof createSound> | null>(null);
  const listenersAttached = useRef<boolean>(false);
  const [currTime, setCurrTime] = useState<number>();
  const [durationTime, setDurationTime] = useState<number | undefined>(
    audioDuration,
  );
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
      });

      sound.addPlaybackEndListener(event => {
        setPlaying(false);
        const currentSeconds = event.currentPosition / 1000;
        const durationSeconds = event.duration / 1000;
        setCurrTime(currentSeconds);
        setDurationTime(durationSeconds);
      });

      listenersAttached.current = true;
    } catch (error) {}
  }, []);

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
    setDurationTime(audioDuration);
    try {
      soundRef.current?.stopPlayer();
      soundRef.current?.removePlayBackListener();
      soundRef.current?.removePlaybackEndListener();
    } catch (error) {
    } finally {
      listenersAttached.current = false;
    }
  }, [audioUrl, audioDuration]);

  const onPress = async () => {
    if (disabled) {
      return;
    }
    try {
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
