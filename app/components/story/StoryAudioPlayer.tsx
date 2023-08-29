import {TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {toMinuteSeconds} from '../../service/time-display.service';
import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {XSmallText} from '../styled/components/Text';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import Image from '../styled/components/Image';

type Props = {
  audioURL: string;
};

export const StoryAudioPlayer = ({audioURL}: Props): JSX.Element => {
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
        listThumbnail={true}>
        {isControlShown ? (
          <>
            <Icon
              name={
                isAudioPlaying
                  ? 'pause-circle-outline'
                  : 'caret-forward-circle-outline'
              }
              size={45}
              color={Color.WHITE}
              onPress={() => {
                try {
                  if (isAudioPlaying) {
                    audio?.pause();
                    setAudioPlaying(false);
                  } else {
                    audio?.play(() => {
                      setAudioPlaying(false);
                      setAudioDisplayTimeText(
                        `${toMinuteSeconds(
                          audio.getDuration(),
                        )} / ${toMinuteSeconds(audio.getDuration())}`,
                      );
                    });

                    setAudioPlaying(true);
                  }
                } catch (e) {
                  console.log('cannot play the sound file', e);
                }
              }}
            />
            <XSmallText color={Color.WHITE} fontWeight={500}>
              {audioDisplayTimeText}
            </XSmallText>
          </>
        ) : (
          <ContentContainer
            position="absolute"
            justifyContent="center"
            alignItems="center"
            height="100%"
            gap="5px"
            opacity={!isClicked ? 100 : 0}>
            <TouchableOpacity
              onPressIn={() => {
                if (!isClicked) {
                  setClicked(true);
                  setIsControlShown(true);
                }
              }}>
              <Image
                source={require('../../assets/images/record-icon.png')}
                style={{width: 40, height: 40}}
              />
            </TouchableOpacity>
            <XSmallText color={Color.WHITE} fontWeight={500}>
              {audio ? toMinuteSeconds(audio.getDuration()) : ''}
            </XSmallText>
          </ContentContainer>
        )}
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
      </ContentContainer>
    </>
  );
};
