import {TouchableWithoutFeedback} from 'react-native';
import {toMinuteSeconds} from '../../service/date-time-display.service.ts';
import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';

import {LegacyColor} from '../../constants/color.constant';
import {XSmallText} from '../styled/components/LegacyText.tsx';

import {ContentContainer} from '../styled/container/ContentContainer';
import Image from '../styled/components/Image';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

type Props = {
  audioURL: string;
  isFocused?: boolean;
  listThumbnail?: boolean;
  activeMediaIndexNo?: number;
};

export const StoryAudioPlayer = ({
  audioURL,
  isFocused,
  listThumbnail,
  activeMediaIndexNo,
}: Props): JSX.Element => {
  const [audio, setAudio] = useState<Sound>();
  const [audioDisplayTimeText, setAudioDisplayTimeText] = useState<string>();
  const [isAudioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [isClicked, setClicked] = useState<boolean>(false);
  const [isControlShown, setIsControlShown] = useState<boolean>(false);
  const navigation = useNavigation<BasicNavigationProps>();

  useEffect(() => {
    setClicked(false);
    setIsControlShown(false);
    setAudioPlaying(false);
    audio?.pause();
  }, [activeMediaIndexNo]);

  useEffect(() => {
    if (!isFocused) {
      setAudioPlaying(false);
      audio?.pause();
    }
  }, [isFocused]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      setAudioPlaying(false);
      audio?.pause();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, audio]);

  useEffect(() => {
    if (!audioURL) {
      return;
    }

    try {
      Sound.setCategory('Playback');
      const audioSound = new Sound(audioURL, undefined, error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }

        setAudio(audioSound);
        setAudioPlaying(false);
        setAudioDisplayTimeText(
          `00:00 / ${toMinuteSeconds(audioSound.getDuration())}`,
        );
      });
    } catch (e) {
      console.log('cannot play the sound file', e);
    }
  }, [audioURL]);

  useEffect(() => {
    if (isAudioPlaying) {
      const timer = setInterval(() => {
        audio?.getCurrentTime((seconds, isPlaying) => {
          if (isPlaying) {
            setAudioDisplayTimeText(
              `${toMinuteSeconds(seconds)} / ${toMinuteSeconds(
                audio.getDuration(),
              )}`,
            );
          } else {
            if (seconds >= audio.getDuration()) {
              setAudioDisplayTimeText(
                `${toMinuteSeconds(audio.getDuration())} / ${toMinuteSeconds(
                  audio.getDuration(),
                )}`,
              );
            }
            clearInterval(timer);
          }
        });
      }, 500);
    }
  }, [isAudioPlaying]);

  const onPress = () => {
    try {
      if (isAudioPlaying) {
        audio?.pause();
        setAudioPlaying(false);
      } else {
        audio?.play(() => {
          setAudioPlaying(false);
          setAudioDisplayTimeText(
            `${toMinuteSeconds(audio.getDuration())} / ${toMinuteSeconds(
              audio.getDuration(),
            )}`,
          );
        });

        setAudioPlaying(true);
      }
    } catch (e) {
      console.log('cannot play the sound file', e);
    }
  };

  if (!audioURL) {
    return <></>;
  }

  return (
    <ContentContainer
      alignCenter
      height="100%"
      backgroundColor={LegacyColor.DARK_BLUE}>
      <ContentContainer alignCenter withNoBackground gap={8}>
        <TouchableWithoutFeedback onPressIn={onPress}>
          <Image
            source={
              isAudioPlaying
                ? require('../../assets/images/control_pause_icon.png')
                : require('../../assets/images/control_play_icon.png')
            }
            style={{width: 45, height: 45}}
          />
        </TouchableWithoutFeedback>
        <XSmallText color={LegacyColor.WHITE} fontWeight={500}>
          {audioDisplayTimeText}
        </XSmallText>
        <TouchableWithoutFeedback
          onPress={() => {
            if (!isAudioPlaying && isControlShown) {
              setIsControlShown(false);
              setClicked(false);
              audio?.reset();
            }
          }}>
          <ContentContainer
            absoluteTopPosition
            height="100%"
            zIndex={-1}
            opacity={0}
          />
        </TouchableWithoutFeedback>
      </ContentContainer>
    </ContentContainer>
  );
};
