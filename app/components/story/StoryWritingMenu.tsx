import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, {useEffect, useMemo, useRef} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer';
import Config from 'react-native-config';
import {Easing} from 'react-native-reanimated';

import {StoryWritingMenuBtn} from './StoryWritingMenuBtn';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {VoicePlayer} from './StoryVoicePlayer';
import {Keyboard, Pressable} from 'react-native';
import {useVoiceRecorder} from '../../service/hooks/voice-record.hook';
import {BasicNavigationProps} from '../../navigation/types';

type Props = {
  keyboardVisible?: boolean;
};

export const StoryWritingMenu = ({
  keyboardVisible = true,
}: Props): JSX.Element => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const voiceToText = writingStory.voice ? true : false;
  const playVoice = writingStory.voice ? true : false;
  const textToImage = Config.TEXT_TO_IMAGE == 'TRUE';
  const openAlbum = true;
  const iconCnt =
    (voiceToText ? 1 : 0) +
    (playVoice ? 1 : 0) +
    (textToImage ? 1 : 0) +
    (openAlbum ? 1 : 0);

  //bottom sheet
  const menuModalRef = useRef<BottomSheetModal>(null);
  const playModalRef = useRef<BottomSheetModal>(null);
  const mSnapPoints = useMemo(() => [iconCnt * 60 + 30], []);
  const pSnapPoints = useMemo(() => ['15%'], []);

  const navigation = useNavigation<BasicNavigationProps>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (playInfo.isOpen) {
        setPlayInfo({
          isOpen: false,
          isPlay: false,
          playTime: '00:00:00',
          currentPositionSec: 0,
        });
        stopPlay();
        playModalRef.current?.close();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  //음성 재생
  useEffect(() => {
    if (playInfo.isOpen) {
      menuModalRef.current?.close();
      playModalRef.current?.present();
    } else {
      if (!keyboardVisible) {
        menuModalRef.current?.present();
        menuModalRef.current?.snapToIndex(0);
      }
      setPlayInfo({
        isOpen: false,
        isPlay: false,
        playTime: '00:00:00',
        currentPositionSec: 0,
      });
      stopPlay();
      playModalRef.current?.close();
    }
  }, [playInfo.isOpen]);
  useEffect(() => {
    if (keyboardVisible) {
      menuModalRef.current?.close();
      if (playInfo.isOpen) {
        setPlayInfo({
          isOpen: false,
          isPlay: false,
          playTime: '00:00:00',
          currentPositionSec: 0,
        });
        stopPlay();
        playModalRef.current?.close();
      }
    }
  }, [keyboardVisible]);
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 20,
    easing: Easing.exp,
  });
  const {fileName, startPlay, pausePlay, stopPlay, seekPlay} = useVoiceRecorder(
    {
      audioUrl: writingStory.voice,
    },
  );
  return (
    <>
      <BottomSheetModal
        ref={playModalRef}
        index={0}
        bottomInset={60}
        detached={true}
        snapPoints={pSnapPoints}
        animationConfigs={animationConfigs}
        handleHeight={0}
        handleComponent={null}
        enableDismissOnClose={true}
        enablePanDownToClose={false}
        style={{
          marginHorizontal: 16,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          elevation: 5,
        }}>
        <ContentContainer withContentPadding borderRadius={30}>
          <VoicePlayer
            modal
            source={writingStory.voice ?? ''}
            startPlay={startPlay}
            pausePlay={pausePlay}
            stopPlay={stopPlay}
            seekPlay={seekPlay}></VoicePlayer>
        </ContentContainer>
      </BottomSheetModal>

      {!playInfo.isOpen ? (
        <Pressable
          onPressIn={() => {
            if (keyboardVisible) {
              Keyboard.dismiss();
            }
          }}
          onPress={() => {
            if (iconCnt > 1) {
              menuModalRef.current?.present();
              menuModalRef.current?.snapToIndex(0);
            }
          }}>
          <StoryWritingMenuBtn type="bar" />
        </Pressable>
      ) : (
        <></>
      )}
      {iconCnt > 1 ? (
        <BottomSheetModal
          ref={menuModalRef}
          index={0}
          snapPoints={mSnapPoints}
          enableDismissOnClose={true}
          enablePanDownToClose={true}
          animationConfigs={animationConfigs}
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <BottomSheetView>
            <StoryWritingMenuBtn type="list" />
          </BottomSheetView>
        </BottomSheetModal>
      ) : (
        <></>
      )}
    </>
  );
};
