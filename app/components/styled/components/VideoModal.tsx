import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Pressable, Image} from 'react-native';
import {useSharedValue, useDerivedValue} from 'react-native-reanimated';
import {SvgIcon} from './SvgIcon';
import {ContentContainer} from '../container/ContentContainer';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '@gorhom/bottom-sheet';
import {VideoPlayer} from '../../story/StoryVideoPlayer';
type Props = {
  opened?: boolean;
  thumbnailUrl?: string;
  videoUri?: string;
  onClose?: () => void;
};

export default function VideoModal({opened, videoUri, onClose}: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const baseScale = useSharedValue(1); // 이전까지의 축적된 scale
  const pinchScale = useSharedValue(1); // 현재 제스처에서의 scale

  const scale = useDerivedValue(() => {
    return baseScale.value * pinchScale.value;
  });
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    if (videoUri) {
      Image.getSize(
        videoUri,
        (originalWidth, originalHeight) => {
          const ratio = originalHeight / originalWidth;
          setImageHeight(SCREEN_WIDTH * ratio);
        },
        error => {
          console.error('Image load failed', error);
        },
      );
    }
  }, [opened, videoUri]);

  const handleClose = () => {
    baseScale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    lastTranslateX.value = 0;
    lastTranslateY.value = 0;
    setImageHeight(0);

    onClose && onClose();
  };

  if (!opened || !videoUri) {
    return null;
  }

  return (
    <Modal visible={opened} transparent={true}>
      <ContentContainer withNoBackground flex={1} alignCenter gap={12}>
        <Pressable style={styles.dimmedBackground} />
        <ContentContainer
          alignItems="flex-end"
          paddingRight={12}
          withNoBackground>
          <SvgIcon name={'closeWhite'} onPress={handleClose} />
        </ContentContainer>
        <ContentContainer height={500}>
          <VideoPlayer
            videoUrl={videoUri}
            width={SCREEN_HEIGHT - 100}
            activeMediaIndexNo={1}
            setPaginationShown={() => {}}
          />
        </ContentContainer>
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
