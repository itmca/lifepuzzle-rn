import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {BasicNavigationProps} from '../../navigation/types';
import Sound from 'react-native-sound';
import {toMmSs, toMmSsSS} from '../../service/date-time-display.service';
import {VoicePlayButton} from '../button/VoicePlayButton.tsx';
import {useRecoilState} from 'recoil';
import {playInfoState} from '../../recoils/story-write.recoil';

type AudioBtnProps = {
  audioUrl?: string;
  disabled?: boolean;
  onPlay: () => void;
};
export const AudioBtn = ({
  audioUrl,
  disabled,
  onPlay,
}: AudioBtnProps): JSX.Element => {
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const [audio, setAudio] = useState<Sound>();
  const [currTime, setCurrTime] = useState<number>();
  const [durationTime, setDurationTime] = useState<number>();
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const navigation = useNavigation<BasicNavigationProps>();

  useEffect(() => {
    return () => {
      audio?.stop();
      audio?.release();
    };
  }, [navigation, audio]);

  useEffect(() => {
    if (isPlaying) {
      audio?.stop();
      setPlaying(false);
    }
    if (!audioUrl) {
      return;
    }
    try {
      Sound.setCategory('Playback');
      const audioSound = new Sound(audioUrl, undefined, error => {
        if (error) {
          // TODO: 예외 처리
          console.log('error', error);
          return;
        }
        setAudio(audioSound);
        setPlaying(false);
        setDurationTime(audioSound.getDuration());
      });
    } catch (e) {
      // TODO: 예외 처리
    }
  }, [audioUrl]);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        audio?.getCurrentTime((seconds, isPlaying) => {
          if (isPlaying) {
            setCurrTime(seconds);
            setDurationTime(audio.getDuration());
          } else {
            if (seconds >= audio.getDuration()) {
              setCurrTime(audio.getDuration());
              setDurationTime(audio.getDuration());
            }
            clearInterval(timer);
          }
        });
      }, 500);
    }
  }, [isPlaying]);

  const onPress = () => {
    if (disabled) return;
    try {
      setPlayInfo({
        currentDurationSec: durationTime,
        duration: toMmSsSS(durationTime ?? 0),
      });
      onPlay && onPlay();
    } catch (e) {
      // TODO: 예외 처리
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
      }></VoicePlayButton>
  );
};
