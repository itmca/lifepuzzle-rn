import {TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {XSmallText} from '../styled/components/LegacyText.tsx';
import {Color} from '../../constants/color.constant';
import {BasicNavigationProps} from '../../navigation/types';
import {ContentContainer} from '../styled/container/ContentContainer';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {toMinuteSeconds} from '../../service/date-time-display.service';
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
          console.log('failed to load the sound', error);
          return;
        }

        setAudio(audioSound);
        setPlaying(false);
        setDurationTime(audioSound.getDuration());
      });
    } catch (e) {
      console.log('cannot play the sound file', e);
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
      console.log('cannot play the sound file', e);
    }
  };

  if (!audioUrl) {
    return <></>;
  }

  return (
    <TouchableOpacity
      style={{
        backgroundColor: isPlaying ? '#03ACEE' : '#9BE3FF',
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
      onPress={onPress}>
      <ContentContainer
        width={'auto'}
        useHorizontalLayout
        gap={4}
        backgroundColor={'transparent'}>
        <Icon size={16} color={Color.WHITE} name={'mic'} />
        <ContentContainer
          width={'auto'}
          backgroundColor={'transparent'}
          paddingRight={2}>
          <XSmallText lineHeight={20} letterSpacing={-3} color={Color.WHITE}>
            {isPlaying
              ? toMinuteSeconds(currTime ?? 0)
              : toMinuteSeconds(durationTime ?? 0)}
          </XSmallText>
        </ContentContainer>
      </ContentContainer>
    </TouchableOpacity>
  );
};
