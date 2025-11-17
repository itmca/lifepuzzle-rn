import React, { useEffect, useMemo, useRef } from 'react';
import { ContentContainer } from '../../ui/layout/ContentContainer';

import { useNavigation } from '@react-navigation/native';

import { useStoryStore } from '../../../stores/story.store';
import { VoicePlayer, VoicePlayerRef } from './StoryVoicePlayer.tsx';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import BottomSheet from '../../ui/interaction/BottomSheet.tsx';

type Props = {
  opened?: boolean;
  editable?: boolean;
  onClose?: () => void;
};

export const VoiceBottomSheet = (props: Props): JSX.Element => {
  // Refs
  const voicePlayerRef = useRef<VoicePlayerRef>(null);

  // 글로벌 상태 관리 (Zustand)
  const writingStory = useStoryStore(state => state.writingStory);
  const setWritingStory = useStoryStore(state => state.setWritingStory);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Memoized 값
  const mSnapPoints = useMemo(() => ['30%'], []);

  // Custom functions
  const handleClose = () => {
    voicePlayerRef.current?.stopAllAudio?.();
    props.onClose && props.onClose();
  };

  // Side effects
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (props.opened) {
        voicePlayerRef.current?.stopAllAudio?.();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, props.opened]);

  //음성 재생
  useEffect(() => {
    if (!props.opened) {
      handleClose();
    }
  }, [props.opened]);

  return (
    <>
      <BottomSheet
        opened={props.opened}
        title={'음성메모'}
        onClose={handleClose}
        snapPoints={mSnapPoints}
      >
        <ContentContainer>
          <VoicePlayer
            ref={voicePlayerRef}
            source={writingStory.voice}
            editable={props.editable}
            onSave={uri => {
              setWritingStory({ voice: uri });
            }}
            onDelete={() => {
              setWritingStory({ voice: undefined });
            }}
            onClose={handleClose}
          />
        </ContentContainer>
      </BottomSheet>
    </>
  );
};
