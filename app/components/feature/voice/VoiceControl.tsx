import React from 'react';
import { VoiceAddButton } from './VoiceAddButton';
import { AudioBtn } from '../story/AudioBtn';

type VoiceControlProps = {
  /** 음성 파일 URL (없으면 추가 버튼, 있으면 재생 버튼 표시) */
  audioUrl?: string;
  /** 음성 추가 버튼 클릭 시 콜백 */
  onAddVoice: () => void;
  /** 음성 재생 버튼 클릭 시 콜백 */
  onPlayVoice: () => void;
};

/**
 * 음성 추가/재생 통합 컨트롤 컴포넌트
 *
 * @description
 * - audioUrl이 없으면 VoiceAddButton 표시
 * - audioUrl이 있으면 AudioBtn (재생 버튼) 표시
 * - 조건부 렌더링 로직을 컴포넌트 내부로 캡슐화
 *
 * @example
 * <VoiceControl
 *   audioUrl={story?.audios?.[0]}
 *   onAddVoice={() => setActiveModal('voice')}
 *   onPlayVoice={() => setActiveModal('voice')}
 * />
 */
export const VoiceControl = ({
  audioUrl,
  onAddVoice,
  onPlayVoice,
}: VoiceControlProps): React.ReactElement => {
  if (!audioUrl) {
    return <VoiceAddButton onPress={onAddVoice} />;
  }

  return <AudioBtn audioUrl={audioUrl} onPlay={onPlayVoice} />;
};
