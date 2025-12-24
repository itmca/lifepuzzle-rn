import React, { useEffect, useMemo, useRef } from 'react';
import { ContentContainer } from '../../../../../components/ui/layout/ContentContainer';

import { useNavigation } from '@react-navigation/native';

import { VoiceRecorder } from '../audio/VoiceRecorder';
import { VoiceRecorderRef } from '../../../../../types/voice/voice-player.type';
import { BasicNavigationProps } from '../../../../../navigation/types.tsx';
import { BottomSheet } from '../../../../../components/ui/interaction/BottomSheet.tsx';
import { LoadingContainer } from '../../../../../components/ui/feedback/LoadingContainer';
type Props = {
  opened?: boolean;
  editable?: boolean;
  onClose?: () => void;
  /**
   * 음성 저장 시 호출되는 콜백 (required for editable mode)
   */
  onSaveVoice?: (voiceUri: string) => void;
  /**
   * 음성 삭제 시 호출되는 콜백 (required for editable mode)
   */
  onDeleteVoice?: () => void;
  /**
   * 음성 URI
   */
  voiceSource?: string;
  /**
   * 업로드 중 로딩 상태
   */
  isLoading?: boolean;
};

export const VoiceBottomSheet = (props: Props): React.ReactElement => {
  // Refs
  const voiceRecorderRef = useRef<VoiceRecorderRef>(null);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Memoized 값
  const mSnapPoints = useMemo(() => ['30%'], []);

  // Custom functions
  const handleClose = () => {
    voiceRecorderRef.current?.stopAllAudio?.();
    props.onClose?.();
  };

  const handleSave = (uri: string) => {
    props.onSaveVoice?.(uri);
  };

  const handleDelete = () => {
    props.onDeleteVoice?.();
  };

  // Side effects
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (props.opened) {
        voiceRecorderRef.current?.stopAllAudio?.();
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
        <LoadingContainer isLoading={props.isLoading ?? false}>
          <ContentContainer>
            <VoiceRecorder
              ref={voiceRecorderRef}
              source={props.voiceSource}
              editable={props.editable}
              onSave={handleSave}
              onDelete={handleDelete}
              onClose={handleClose}
              isUploading={props.isLoading}
            />
          </ContentContainer>
        </LoadingContainer>
      </BottomSheet>
    </>
  );
};
