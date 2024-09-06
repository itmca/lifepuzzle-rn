import {Color} from '../../constants/color.constant.ts';
import React, {useEffect} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {Pressable, View, Dimensions} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {XXSmallText} from '../styled/components/Text.tsx';
import {styles} from './styles.ts';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {
  writingStoryState,
  playInfoState,
} from '../../recoils/story-write.recoil.ts';
import {useVoiceRecorder} from '../../service/hooks/voice-record.hook.ts';

type props = {
  source: string | undefined;
  disable?: boolean;
  modal?: boolean;
  startPlay: () => Promise<void>;
  pausePlay: () => Promise<void>;
  stopPlay: () => Promise<void>;
  seekPlay: (sec: number) => Promise<void>;
  onDelete?: () => void;
};

export const VoicePlayer = ({
  source,
  disable,
  modal = false,
  startPlay,
  pausePlay,
  stopPlay,
  seekPlay,
  onDelete,
}: props) => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const resetPlayInfo = useResetRecoilState(playInfoState);
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      stopPlay();
      setPlayInfo({isPlay: false, playTime: '00:00:00', currentPositionSec: 0});
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);
  const DeviceWidth = Dimensions.get('window').width;

  const onReplay = () => {
    const currentPosition = Math.round(playInfo?.currentPositionSec ?? 0);
    const subSecs = Math.max(Math.round(currentPosition - 10000), 1);
    seekPlay(subSecs);
  };
  const onForward = () => {
    const currentPosition = Math.round(playInfo?.currentPositionSec ?? 0);
    const addSecs = Math.min(
      Math.round(currentPosition + 10000),
      playInfo?.currentDurationSec ?? 1,
    );
    seekPlay(addSecs);
  };
  const onClose = () => {
    stopPlay();
    resetPlayInfo();
    onDelete?.();
  };
  return (
    <>
      <ContentContainer>
        <ContentContainer useHorizontalLayout>
          <XXSmallText color={disable ? Color.FONT_GRAY : Color.BLACK}>
            {playInfo.playTime
              ? playInfo.playTime.substring(
                  0,
                  playInfo.playTime.lastIndexOf(':'),
                )
              : '00:00'}
          </XXSmallText>
          <XXSmallText color={disable ? Color.FONT_GRAY : Color.BLACK}>
            {playInfo.duration
              ? playInfo.duration.substring(
                  0,
                  playInfo.duration.lastIndexOf(':'),
                )
              : '00:00'}
          </XXSmallText>
        </ContentContainer>
        <View style={styles.viewBar}>
          <View
            style={[
              styles.viewBarPlay,
              {
                width:
                  playInfo.currentPositionSec && playInfo.currentDurationSec
                    ? (playInfo.currentPositionSec /
                        playInfo.currentDurationSec) *
                      DeviceWidth
                    : 0,
              },
            ]}
          />
        </View>
      </ContentContainer>
      <ContentContainer useHorizontalLayout height={'52px'}>
        <Pressable disabled={disable} onPress={onReplay}>
          <MaterialIcons
            size={40}
            color={disable ? Color.FONT_GRAY : Color.BLACK}
            name={'replay-10'}
          />
        </Pressable>
        <Pressable
          disabled={disable}
          onPress={() => {
            playInfo.isPlay ? pausePlay() : startPlay();
          }}>
          <FontAwesome6
            size={32}
            color={disable ? Color.FONT_GRAY : Color.PRIMARY_LIGHT}
            name={playInfo.isPlay ? 'pause' : 'play'}
          />
        </Pressable>
        <Pressable disabled={disable} onPress={onForward}>
          <MaterialIcons
            size={40}
            color={disable ? Color.FONT_GRAY : Color.BLACK}
            name={'forward-10'}
          />
        </Pressable>
        {modal ? (
          <Pressable
            disabled={disable}
            onPress={() => {
              setPlayInfo({isOpen: false});
              stopPlay();
            }}>
            <MaterialIcons
              size={40}
              color={disable ? Color.FONT_GRAY : Color.BLACK}
              name={'close'}
            />
          </Pressable>
        ) : (
          <Pressable disabled={disable} onPress={onClose}>
            <MaterialIcons
              size={40}
              color={disable ? Color.FONT_GRAY : Color.BLACK}
              name={'delete'}
            />
          </Pressable>
        )}
      </ContentContainer>
    </>
  );
};
