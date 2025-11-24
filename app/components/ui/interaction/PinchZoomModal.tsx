import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FastImage from '@d11/react-native-fast-image';
import { SvgIcon } from '../display/SvgIcon';
import { ContentContainer } from '../layout/ContentContainer';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { Color } from '../../../constants/color.constant';

type Props = {
  opened?: boolean;
  imageUri?: string;
  onClose?: () => void;
};

export default function PinchZoomModal({ opened, imageUri, onClose }: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const baseScale = useSharedValue(1); // 이전까지의 축적된 scale
  const pinchScale = useSharedValue(1); // 현재 제스처에서의 scale

  const scale = useDerivedValue(() => {
    return baseScale.value * pinchScale.value;
  });
  // 기본 높이를 화면 너비로 설정 (정사각형), 이미지 로드 후 실제 비율로 업데이트
  const [imageHeight, setImageHeight] = useState(SCREEN_WIDTH);

  const handleImageLoad = (e: {
    nativeEvent: { width: number; height: number };
  }) => {
    const { width, height } = e.nativeEvent;
    if (width > 0) {
      const ratio = height / width;
      setImageHeight(SCREEN_WIDTH * ratio);
    }
  };

  useEffect(() => {
    // 모달이 닫힐 때 높이 리셋
    if (!opened) {
      setImageHeight(SCREEN_WIDTH);
    }
  }, [opened]);
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // 제스처 시작 시 아무것도 안 함
    })
    .onUpdate(e => {
      translateX.value = e.translationX + lastTranslateX.value;
      translateY.value = e.translationY + lastTranslateY.value;
    })
    .onEnd(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onUpdate(e => {
      pinchScale.value = e.scale;
    })
    .onEnd(() => {
      // 제스처 종료 시 scale 누적
      baseScale.value *= pinchScale.value;
      pinchScale.value = 1;

      // 축소 시 리셋
      if (baseScale.value < 1) {
        baseScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
      }
    });
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (baseScale.value > 1) {
        // 축소
        baseScale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
      } else {
        // 확대
        baseScale.value = withTiming(2); // 원하는 배율로 조정 가능
      }
    });
  const composed = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture,
  );
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const handleClose = () => {
    baseScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    lastTranslateX.value = 0;
    lastTranslateY.value = 0;
    setImageHeight(0);

    onClose && onClose();
  };

  if (!opened || !imageUri) {
    return null;
  }

  return (
    <Modal visible={opened} transparent={true}>
      <ContentContainer withNoBackground flex={1} alignCenter gap={12}>
        <Pressable style={styles.dimmedBackground} />
        <ContentContainer
          alignItems="flex-end"
          paddingRight={12}
          withNoBackground
        >
          <SvgIcon name={'closeWhite'} onPress={handleClose} />
        </ContentContainer>
        <GestureDetector gesture={composed}>
          <Animated.View
            style={[
              {
                width: SCREEN_WIDTH,
                height: imageHeight,
              },
              animatedStyle,
            ]}
          >
            <FastImage
              source={{
                uri: imageUri,
                priority: FastImage.priority.high,
                cache: FastImage.cacheControl.immutable,
              }}
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: Color.GREY_700,
              }}
              resizeMode={FastImage.resizeMode.contain}
              onLoad={handleImageLoad}
            />
          </Animated.View>
        </GestureDetector>
      </ContentContainer>
    </Modal>
  );
}

const styles = StyleSheet.create({
  dimmedBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.6,
  },
});
