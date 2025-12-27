import React from 'react';

import { toMmSs } from '../../../../../utils/time-formatter.util.ts';
import { VoicePlayButton } from './VoicePlayButton';

type AudioBtnProps = {
  audioUrl?: string;
  audioDurationSeconds?: number;
  disabled?: boolean;
  beforePlay: () => void;
};

/**
 * 저장된 음성 표시 버튼 컴포넌트
 *
 * @description
 * - 서버에서 받은 음성 재생 시간을 표시
 * - 클릭 시 VoiceBottomSheet를 열어서 재생
 * - 실제 재생 기능은 VoiceRecorder에서 처리
 */
export const AudioBtn = ({
  audioUrl,
  audioDurationSeconds,
  disabled,
  beforePlay,
}: AudioBtnProps): React.ReactElement => {
  const onPress = () => {
    if (disabled) {
      return;
    }
    beforePlay();
  };

  if (!audioUrl) {
    return <></>;
  }

  return (
    <VoicePlayButton
      onPress={onPress}
      playDurationText={toMmSs(audioDurationSeconds ?? 0)}
    />
  );
};
