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

import {
  OpenAlbum,
  PlayVoice,
  TextToImage,
  VoiceToText,
} from './StoryWritingMenuBtn';
import {useFocusEffect} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {VoicePlayer} from './StoryVoicePlayer';
import {Pressable} from 'react-native';
type Props = {
  visible?: boolean;
};

export const StoryWritingMenu = ({visible = true}: Props): JSX.Element => {
  //bottom sheet
  const menuModalRef = useRef<BottomSheetModal>(null);
  const playModalRef = useRef<BottomSheetModal>(null);
  const mSnapPoints = useMemo(() => ['35%'], []);
  const pSnapPoints = useMemo(() => ['15%'], []);

  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const showList =
    (writingStory.voice ?? false) || Config.TEXT_TO_IMAGE == 'TRUE'
      ? true
      : false;

  const handleSheetChanges = useCallback((index: number) => {
    console.log(index);
  }, []);
  //load
  useEffect(() => {
    if (showList) {
      menuModalRef.current?.present();
      menuModalRef.current?.snapToIndex(0);
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
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (!visible) {
          // menuModalRef.current?.snapToIndex(-1);
          // playModalRef.current?.close();
        } else {
          // setPlayInfo({isOpen: false});
        }
      };
    }, []),
  );
  //음성 재생
  useEffect(() => {
    if (playInfo.isOpen) {
      //menuModalRef.current?.present();
      //menuModalRef.current?.snapToIndex(-1);
      menuModalRef.current?.close();
      playModalRef.current?.present();
    } else {
      menuModalRef.current?.present();
      menuModalRef.current?.snapToIndex(0);
      playModalRef.current?.close();
    }
  }, [playInfo.isOpen]);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 20,
    easing: Easing.exp,
  });

  return (
    <>
      <BottomSheetModal
        ref={playModalRef}
        handleHeight={0}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
        bottomInset={30}
        detached={true}
        index={0}
        backdropComponent={playBackdrop}
        snapPoints={pSnapPoints}
        animationConfigs={animationConfigs}
        handleComponent={null}
        style={{
          marginHorizontal: 16,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <ContentContainer withContentPadding>
          <VoicePlayer modal voiceUrl={writingStory.voice ?? ''}></VoicePlayer>
        </ContentContainer>
      </BottomSheetModal>

      {playInfo.isOpen ? (
        <></>
      ) : (
        <Pressable
          onPressOut={() => {
            if (showList) {
              menuModalRef.current?.present();
              menuModalRef.current?.snapToIndex(0);
            }
          }}>
          <ContentContainer
            withScreenPadding
            useHorizontalLayout
            justifyContent="space-evenly">
            <VoiceToText />
            <PlayVoice />
            <TextToImage />
            <OpenAlbum />
          </ContentContainer>
        </Pressable>
      )}
      <BottomSheetModal
        ref={menuModalRef}
        enableDismissOnClose={false}
        enablePanDownToClose={true}
        index={-1}
        backdropComponent={menuBackdrop}
        snapPoints={mSnapPoints}
        onChange={handleSheetChanges}
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
          <VoiceToText showText />
          <PlayVoice showText />
          <TextToImage showText />
          <OpenAlbum showText />
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};
