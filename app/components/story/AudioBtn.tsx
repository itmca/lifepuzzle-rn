import {TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {LegacyColor} from '../../constants/color.constant';
import {XSmallText} from '../styled/components/LegacyText.tsx';

import {BasicNavigationProps} from '../../navigation/types';
import {ContentContainer} from '../styled/container/ContentContainer';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {toMinuteSeconds} from '../../service/date-time-display.service';
import {VoicePlayButton} from '../button/VoicePlayButton.tsx';

type AudioBtnProps = {
  audioUrl?: string;
  disabled?: boolean;
};
export const AudioBtn = ({audioUrl, disabled}: AudioBtnProps): JSX.Element => {
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
      if (isPlaying) {
        audio?.pause();
        setPlaying(false);
      } else {
        audio?.play(() => {
          setPlaying(false);

          setCurrTime(audio.getDuration());
          setDurationTime(audio.getDuration());
        });

        setPlaying(true);
      }
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
        isPlaying
          ? toMinuteSeconds(currTime ?? 0)
          : toMinuteSeconds(durationTime ?? 0)
      }></VoicePlayButton>
  );
};
