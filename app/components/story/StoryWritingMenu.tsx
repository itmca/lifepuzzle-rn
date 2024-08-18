import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetModal,
  useBottomSheet,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer';

import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
type Props = {
  visible?: boolean;
};

export const StoryWritingMenu = ({visible = true}: Props): JSX.Element => {
  //bottom sheet
  const menuModalRef = useRef<BottomSheetModal>(null);
  const playModalRef = useRef<BottomSheetModal>(null);

  const mSnapPoints = useMemo(() => ['15%', '35%'], []);
  const pSnapPoints = useMemo(() => ['15%'], []);

  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const [currentPosition, setCurrentPosition] = useState<number>(1);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.exp,
  });
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        currentPosition - 1,
        [-0.85, 0],
        [0, 1],
        Extrapolate.CLAMP,
      ),
    }),
    [currentPosition],
  );
  const handleSheetChanges = useCallback((index: number) => {
    setCurrentPosition(index);
  }, []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={0}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    [],
  );
  useEffect(() => {
    menuModalRef.current?.present();
  }, []);
  useEffect(() => {
    if (playInfo.isOpen) {
      menuModalRef.current?.close();
      playModalRef.current?.present();
    } else {
      menuModalRef.current?.present();
      playModalRef.current?.close();
    }
  }, [playInfo.isOpen]);
  useFocusEffect(
    React.useCallback(() => {
      return () => menuModalRef.current?.snapToIndex(0);
    }, []),
  );

  return (
    <>
      <BottomSheetModal
        ref={menuModalRef}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
        index={0}
        snapPoints={mSnapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        footerComponent={MenuFooter}
        animationConfigs={animationConfigs}>
        <Animated.View style={containerAnimatedStyle}>
          <VoiceToText showText />
          <PlayVoice showText />
          <TextToImage showText />
          <OpenAlbum showText />
        </Animated.View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={playModalRef}
        handleHeight={0}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
        bottomInset={46}
        detached={true}
        index={0}
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
    </>
  );
};

interface MenuFooterProps extends BottomSheetFooterProps {}

const MenuFooter = ({animatedFooterPosition}: MenuFooterProps) => {
  const {bottom: bottomSafeArea} = useSafeAreaInsets();
  const {expand, collapse, animatedIndex} = useBottomSheet();
  const containerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(
        0 - animatedIndex.value,
        [-0.85, 0],
        [0, 1],
        Extrapolate.CLAMP,
      ),
      display: animatedIndex.value == 1 ? 'none' : 'flex',
    }),
    [animatedIndex],
  );
  return (
    <BottomSheetFooter
      // we pass the bottom safe inset
      bottomInset={bottomSafeArea}
      // we pass the provided `animatedFooterPosition`
      animatedFooterPosition={animatedFooterPosition}>
      <Animated.View style={containerAnimatedStyle}>
        <ContentContainer
          withScreenPadding
          useHorizontalLayout
          justifyContent="space-between"
          paddingHorizontal={50}>
          <VoiceToText />
          <PlayVoice />
          <TextToImage />
          <OpenAlbum />
        </ContentContainer>
      </Animated.View>
    </BottomSheetFooter>
  );
};
