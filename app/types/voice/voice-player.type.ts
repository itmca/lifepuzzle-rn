/**
 * Voice Player 관련 타입 정의
 */

/**
 * 플레이어 상태 (State Machine Pattern)
 *
 * @description
 * 각 상태는 명확히 구분되며, 불가능한 상태 조합을 타입 레벨에서 방지합니다.
 * - idle: 초기 상태 (녹음도 재생도 하지 않음)
 * - recording: 녹음 중
 * - ready: 재생 가능한 오디오 파일이 있는 상태 (정지 상태)
 * - playing: 재생 중
 * - paused: 일시정지 (재생 위치 유지)
 */
export type PlayerState =
  | { status: 'idle' }
  | { status: 'recording'; currentDurationMs: number }
  | { status: 'ready'; currentDurationMs: number }
  | {
      status: 'playing';
      currentPositionMs: number;
      currentDurationMs: number;
    }
  | {
      status: 'paused';
      currentPositionMs: number;
      currentDurationMs: number;
    };

/**
 * 음성 재생 정보 (하위 호환성 유지)
 *
 * @description
 * 원천 데이터(밀리초 단위)만 저장합니다.
 * 표시 형식(MM:SS 등)은 각 사용처에서 변환합니다.
 * react-native-nitro-sound 라이브러리와 단위 통일 (밀리초)
 */
export type PlayInfo = {
  /** 재생 중 여부 */
  isPlay?: boolean;
  /** 일시정지 상태 여부 */
  isPaused?: boolean;
  /** 현재 재생 위치 (밀리초) */
  currentPositionMs?: number;
  /** 전체 길이 (밀리초) */
  currentDurationMs?: number;
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
