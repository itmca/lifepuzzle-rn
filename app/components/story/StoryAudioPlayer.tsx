import {TouchableWithoutFeedback} from 'react-native';
import {toMinuteSeconds} from '../../service/time-display.service';
import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {XSmallText} from '../styled/components/Text';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import Image from '../styled/components/Image';
import {MediaThumbnail} from './StoryMediaThumbnail';

type Props = {
  audioURL: string;
  listThumbnail?: boolean;
};

export const StoryAudioPlayer = ({
  audioURL,
  listThumbnail,
}: Props): JSX.Element => {
  const [audio, setAudio] = useState<Sound>();
  const [audioDisplayTimeText, setAudioDisplayTimeText] = useState<string>();
  const [isAudioPlaying, setAudioPlaying] = useState<boolean>(false);

  const [isClicked, setClicked] = useState<boolean>(false);
  const [isControlShown, setIsControlShown] = useState<boolean>(false);

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
    <>
      <ContentContainer
        gap="5px"
        height="100%"
        position="absolute"
        justifyContent="center"
        alignItems="center"
        backgroundColor={Color.DARK_BLUE}
        listThumbnail={listThumbnail ? listThumbnail : false}>
        {isControlShown ? (
          <>
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
            <XSmallText color={Color.WHITE} fontWeight={500}>
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
                height="100%"
                position="absolute"
                zIndex={-1}
                opacity={0}
              />
            </TouchableWithoutFeedback>
          </>
        ) : (
          <MediaThumbnail
            mediaType="audio"
            playingTime={audio ? toMinuteSeconds(audio.getDuration()) : ''}
            onPress={() => {
              if (!isClicked) {
                setClicked(true);
                setIsControlShown(true);
              }
            }}
          />
        )}
      </ContentContainer>
    </>
  );
};
