/**
 * Voice Player 관련 타입 정의
 */

/**
 * 음성 재생 정보
 *
 * @description
 * 원천 데이터(초 단위)만 저장합니다.
 * 표시 형식(MM:SS 등)은 각 사용처에서 변환합니다.
 */
export type PlayInfo = {
  /** 재생 중 여부 */
  isPlay?: boolean;
  /** 현재 재생 위치 (초) */
  currentPositionSec?: number;
  /** 전체 길이 (초) */
  currentDurationSec?: number;
};

/**
 * VoiceRecorder (구 VoicePlayer) 컴포넌트 Props
 */
export type VoiceRecorderProps = {
  /** 음성 파일 URI */
  source?: string;
  /** 초기 재생 시간 (초 단위) - 서버에서 받은 duration */
  initialDurationSeconds?: number;
  /** 편집 가능 여부 (녹음/삭제 가능) */
  editable?: boolean;
  /** 업로드 중 여부 (체크 버튼 비활성화) */
  isUploading?: boolean;
  /** 음성 저장 콜백 */
  onSave: (uri: string) => void;
  /** 음성 삭제 콜백 */
  onDelete?: () => void;
  /** 닫기 콜백 */
  onClose?: () => void;
};

/**
 * VoiceRecorder Ref 타입
 */
export type VoiceRecorderRef = {
  /** 모든 오디오 정지 */
  stopAllAudio: () => void;
};

/**
 * useVoiceRecorder Hook Props
 */
export type VoiceRecorderHookProps = {
  /** 재생할 음성 파일 URL */
  audioUrl?: string;
  /** 초기 재생 시간 (초 단위) - 서버에서 받은 duration */
  initialDurationSeconds?: number;
  /** 녹음 시작 콜백 */
  onStartRecord?: () => void;
  /** 녹음 종료 콜백 */
  onStopRecord?: (uri: string) => void;
};

/**
 * useVoiceRecorder Hook 반환 타입
 */
export type VoiceRecorderHookReturn = {
  /** 녹음된 파일명 */
  fileName: string | undefined;
  /** 녹음 시간 문자열 */
  recordTime: string | undefined;
  /** 녹음 중 여부 */
  isRecording: boolean;
  /** 재생 정보 */
  playInfo: PlayInfo;
  /** 녹음 시작 */
  startRecord: () => Promise<void>;
  /** 녹음 종료 */
  stopRecord: () => Promise<void>;
  /** 재생 시작 */
  startPlay: () => Promise<void>;
  /** 재생 일시정지 */
  pausePlay: () => Promise<void>;
  /** 재생 정지 */
  stopPlay: () => Promise<void>;
  /** 재생 위치 이동 */
  seekPlay: (seconds: number) => Promise<void>;
  /** PlayInfo 초기화 */
  resetPlayInfo: () => void;
};
