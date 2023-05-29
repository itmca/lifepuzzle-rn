import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {toMinuteSeconds} from '../../service/time-display.service';
import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {styles} from './styles';
import { XSmallText } from "../styled/components/Text";

type Props = {
  audioURL: string;
};

export const StoryAudioPlayer = ({audioURL}: Props): JSX.Element => {
  const [audio, setAudio] = useState<Sound>();
  const [audioDisplayTimeText, setAudioDisplayTimeText] = useState<string>();
  const [isAudioPlaying, setAudioPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!audioURL) return;

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
          `00:00/${toMinuteSeconds(audioSound.getDuration())}`,
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
              `${toMinuteSeconds(seconds)}/${toMinuteSeconds(
                audio.getDuration(),
              )}`,
            );
          } else {
            if (seconds >= audio.getDuration()) {
              setAudioDisplayTimeText(
                `${toMinuteSeconds(audio.getDuration())}/${toMinuteSeconds(
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
    <View style={styles.storyAudioContainer}>
      {isAudioPlaying ? (
        <Icon
          name="pause-circle-filled"
          size={36}
          style={{color: 'red'}}
          onPress={() => {
            try {
              audio?.pause();
              setAudioPlaying(false);
            } catch (e) {
              console.log('cannot play the sound file', e);
            }
          }}
        />
      ) : (
        <Icon
          name="play-circle-filled"
          size={36}
          style={{color: 'red'}}
          onPress={() => {
            try {
              audio?.play(() => {
                //audio?.reset();
                setAudioPlaying(false);
                setAudioDisplayTimeText(
                  `${toMinuteSeconds(audio.getDuration())}/${toMinuteSeconds(
                    audio.getDuration(),
                  )}`,
                );
              });
              setAudioPlaying(true);
            } catch (e) {
              console.log('cannot play the sound file', e);
            }
          }}
        />
      )}
      <XSmallText>{audioDisplayTimeText}</XSmallText>
    </View>
  );
};
