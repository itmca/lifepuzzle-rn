import React, {useEffect, useState} from 'react';
import {Modal, StyleSheet, Pressable, Image, Dimensions} from 'react-native';
import {useSharedValue, useDerivedValue} from 'react-native-reanimated';
import {SvgIcon} from './SvgIcon';
import {ContentContainer} from '../container/ContentContainer';
import {VideoPlayer} from '../../story/StoryVideoPlayer';
type Props = {
  opened?: boolean;
  thumbnailUrl?: string;
  videoUri?: string;
  onClose?: () => void;
};

export default function VideoModal({opened, videoUri, onClose}: Props) {
  const DeviceWidth = Dimensions.get('window').width;
  const handleClose = () => {
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
            width={DeviceWidth}
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
