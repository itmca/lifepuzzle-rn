import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer';
import Config from 'react-native-config';
import {Easing} from 'react-native-reanimated';

import {StoryWritingMenuBtn} from './StoryWritingMenuBtn';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {VoicePlayer} from './StoryVoicePlayer';
import {Pressable} from 'react-native';
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

  const handleSheetChanges = useCallback((index: number) => {
    console.log(index);
  }, []);
  //load
  useEffect(() => {
    if (iconCnt > 1) {
    }
  }, []);
  const playBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style, {backgroundColor: 'transparent'}]}
        pressBehavior={'none'}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  const menuBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        style={[props.style, {backgroundColor: 'transparent'}]}
        onPress={() => {
          menuModalRef.current?.close();
        }}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  //close,

  const navigation = useNavigation<BasicNavigationProps>();
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      setPlayInfo({
        isOpen: false,
        isPlay: false,
        playTime: '00:00:00',
        currentPositionSec: 0,
      });
      stopPlay();
      playModalRef.current?.close();
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
      menuModalRef.current?.present();
      menuModalRef.current?.snapToIndex(0);
      playModalRef.current?.close();
    }
  }, [playInfo.isOpen]);
  useEffect(() => {
    if (keyboardVisible) {
      menuModalRef.current?.close();
    } else {
      menuModalRef.current?.present();
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
        bottomInset={30}
        detached={true}
        snapPoints={pSnapPoints}
        backdropComponent={playBackdrop}
        animationConfigs={animationConfigs}
        handleHeight={0}
        handleComponent={null}
        enableDismissOnClose={false}
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

      {playInfo.isOpen || keyboardVisible ? (
        <></>
      ) : (
        <Pressable
          onPressOut={() => {
            if (iconCnt > 1) {
              menuModalRef.current?.present();
              menuModalRef.current?.snapToIndex(0);
            }
          }}>
          <StoryWritingMenuBtn type="bar" />
        </Pressable>
      )}
      <BottomSheetModal
        ref={menuModalRef}
        index={iconCnt > 1 ? 0 : -1}
        snapPoints={mSnapPoints}
        backdropComponent={menuBackdrop}
        animationConfigs={animationConfigs}
        enableDismissOnClose={false}
        enablePanDownToClose={true}
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
    </>
  );
};
