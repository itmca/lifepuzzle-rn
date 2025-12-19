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
  /**
   * 음성 저장 시 호출되는 콜백 (optional)
   * 제공되지 않으면 기본 동작(Zustand store에 저장)을 수행
   */
  onSaveVoice?: (voiceUri: string) => void;
  /**
   * 외부에서 제공하는 음성 URI (optional)
   * 제공되지 않으면 writingStory.voice를 사용
   */
  voiceSource?: string;
};

export const VoiceBottomSheet = (props: Props): React.ReactElement => {
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
            source={props.voiceSource ?? writingStory.voice}
            editable={props.editable}
            onSave={uri => {
              // onSaveVoice prop이 제공되면 사용, 아니면 기본 동작
              if (props.onSaveVoice) {
                props.onSaveVoice(uri);
              } else {
                setWritingStory({ voice: uri });
              }
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
