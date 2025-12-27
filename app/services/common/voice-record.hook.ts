import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';
import Sound from 'react-native-nitro-sound';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getDisplayRecordTime, getRecordFileName } from './voice-record.util';
import { logger } from '../../utils/logger.util.ts';

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

/**
 * 음성 녹음 및 재생 관리 Custom Hook (State Machine Pattern)
 *
 * @description
 * 상태 기계 패턴을 사용하여 음성 녹음, 재생, 일시정지, 정지 등의 기능을 제공합니다.
 * 명확한 상태 전이를 통해 불가능한 상태 조합을 방지하고, 리스너 생명주기를 엄격히 관리합니다.
 *
 * 상태 전이:
 * - idle → recording → ready
 * - ready → playing ⟷ paused
 * - playing/paused → ready (stop)
 *
 * @example
 * const {
 *   isRecording,
 *   playInfo,
 *   startRecord,
 *   stopRecord,
 *   startPlay,
 *   pausePlay,
 *   stopPlay,
 *   resetPlayInfo,
 * } = useVoiceRecorder({
 *   audioUrl: 'file://...',
 *   onStopRecord: (uri) => setAudioUri(uri),
 * });
 */
export const useVoiceRecorder = ({
  audioUrl,
  initialDurationSeconds,
  onStartRecord,
  onStopRecord,
}: VoiceRecorderHookProps): VoiceRecorderHookReturn => {
  // State Machine
  const [playerState, setPlayerState] = useState<PlayerState>(() => {
    // 초기 오디오 URL과 duration이 있으면 ready 상태로 시작
    if (audioUrl && initialDurationSeconds) {
      return {
        status: 'ready',
        currentDurationMs: initialDurationSeconds * 1000,
      };
    }
    return { status: 'idle' };
  });

  const [file, setFile] = useState<string>(audioUrl ?? '');
  const [recordTime, setRecordTime] = useState<string>('00:00:00');
  const [isLoadingDuration, setIsLoadingDuration] = useState(false);

  // 초기화 추적 ref (무한 루프 방지)
  const initializedAudioRef = useRef<string | undefined>(undefined);

  // 리스너 활성화 제어 ref (타이밍 이슈 방지)
  const shouldUpdateFromListenerRef = useRef<boolean>(true);

  /**
   * PlayerState를 PlayInfo로 변환 (하위 호환성)
   */
  const getPlayInfo = useCallback((): PlayInfo => {
    switch (playerState.status) {
      case 'idle':
        return {};
      case 'recording':
        return {
          currentDurationMs: playerState.currentDurationMs,
        };
      case 'ready':
        return {
          currentDurationMs: playerState.currentDurationMs,
        };
      case 'playing':
        return {
          isPlay: true,
          isPaused: false,
          currentPositionMs: playerState.currentPositionMs,
          currentDurationMs: playerState.currentDurationMs,
        };
      case 'paused':
        return {
          isPlay: false,
          isPaused: true,
          currentPositionMs: playerState.currentPositionMs,
          currentDurationMs: playerState.currentDurationMs,
        };
    }
  }, [playerState]);

  /**
   * 모든 리스너 정리 (헬퍼 함수)
   */
  const cleanupListeners = useCallback(() => {
    Sound.removePlayBackListener();
    Sound.removeRecordBackListener();
  }, []);

  /**
   * PlayInfo 초기화 (idle 상태로 전이)
   */
  const resetPlayInfo = useCallback(() => {
    shouldUpdateFromListenerRef.current = false;
    cleanupListeners();
    setPlayerState({ status: 'idle' });
  }, [cleanupListeners]);

  /**
   * 녹음 시작 (idle → recording)
   */
  const startRecord = useCallback(
    async function () {
      // 현재 상태에서 녹음이 불가능하면 먼저 정리
      if (playerState.status === 'playing' || playerState.status === 'paused') {
        await stopPlay();
      }

      const fileName = getRecordFileName();
      const dirs = ReactNativeBlobUtil.fs.dirs;
      const path = Platform.select({
        ios: `${dirs.CacheDir}/${fileName}.m4a`,
        android: `${dirs.CacheDir}/${fileName}.mp4`,
      });
      const audioSet = {
        AudioSamplingRate: 44100,
        AudioEncodingBitRate: 128000,
        AudioChannels: 1,
      };

      // 리스너 정리 및 비활성화
      shouldUpdateFromListenerRef.current = false;
      cleanupListeners();

      // 네이티브 녹음 시작 (await으로 완료 대기)
      const uri = await Sound.startRecorder(path, audioSet);
      setFile(uri);

      // 상태 전이: idle/ready → recording
      setPlayerState({
        status: 'recording',
        currentDurationMs: 0,
      });

      // 녹음 진행 상황 리스너 등록
      Sound.addRecordBackListener(e => {
        const hourMinuteSeconds = getDisplayRecordTime(
          Math.floor(e.currentPosition),
        );
        setRecordTime(hourMinuteSeconds);
        setPlayerState({
          status: 'recording',
          currentDurationMs: e.currentPosition,
        });
      });

      onStartRecord?.();
    },
    [playerState.status, cleanupListeners, onStartRecord],
  );

  /**
   * 녹음 종료 (recording → ready)
   */
  const stopRecord = useCallback(
    async function () {
      if (playerState.status !== 'recording') {
        return;
      }

      // 리스너 비활성화
      shouldUpdateFromListenerRef.current = false;

      // 네이티브 녹음 중지 (await으로 완료 대기)
      await Sound.stopRecorder();
      cleanupListeners();

      // 상태 전이: recording → ready
      const finalDuration =
        playerState.status === 'recording' ? playerState.currentDurationMs : 0;
      setPlayerState({
        status: 'ready',
        currentDurationMs: finalDuration,
      });

      onStopRecord?.(file);
    },
    [playerState, file, onStopRecord, cleanupListeners],
  );

  /**
   * 재생 시작 (ready → playing 또는 paused → playing)
   */
  const startPlay = useCallback(
    async function () {
      // 이미 재생 중이면 중복 실행 방지
      if (playerState.status === 'playing') {
        return;
      }

      // paused 상태에서 재개하는 경우
      const isPausedResume = playerState.status === 'paused';

      // 리스너 정리 후 재등록 (중복 방지)
      cleanupListeners();

      // playBackListener 먼저 등록 (상태 업데이트 준비)
      Sound.addPlayBackListener(e => {
        // 리스너가 비활성화되어 있으면 무시 (pause 타이밍 이슈 방지)
        if (!shouldUpdateFromListenerRef.current) {
          return;
        }

        setPlayerState({
          status: 'playing',
          currentPositionMs: e.currentPosition,
          currentDurationMs: e.duration,
        });

        // 재생 완료 시 ready 상태로 전이
        if (e.currentPosition >= e.duration) {
          shouldUpdateFromListenerRef.current = false;
          cleanupListeners();
          setPlayerState({
            status: 'ready',
            currentDurationMs: e.duration,
          });
        }
      });

      // paused 상태에서 재개하는 경우: resumePlayer 사용
      if (isPausedResume) {
        await Sound.resumePlayer();

        // 상태를 playing으로 전이 (위치는 그대로 유지)
        setPlayerState((prev: PlayerState) => {
          if (prev.status === 'paused') {
            return {
              status: 'playing',
              currentPositionMs: prev.currentPositionMs,
              currentDurationMs: prev.currentDurationMs,
            };
          }
          return prev;
        });
      } else {
        // 처음부터 재생하는 경우: startPlayer 사용
        await Sound.startPlayer(file);

        setPlayerState((prev: PlayerState) => {
          if (prev.status === 'ready') {
            return {
              status: 'playing',
              currentPositionMs: 0,
              currentDurationMs: prev.currentDurationMs,
            };
          }
          return prev;
        });
      }

      // 리스너 활성화
      shouldUpdateFromListenerRef.current = true;
    },
    [playerState, file, cleanupListeners],
  );

  /**
   * 재생 일시정지 (playing → paused)
   */
  const pausePlay = useCallback(
    async function () {
      if (playerState.status !== 'playing') {
        return;
      }

      // 리스너 비활성화 (pause 후 발동되는 이벤트 무시)
      shouldUpdateFromListenerRef.current = false;

      // 네이티브 일시정지
      await Sound.pausePlayer();

      // 리스너 정리 (일시정지 중에는 업데이트 불필요)
      cleanupListeners();

      // 상태 전이: playing → paused (현재 위치 유지)
      setPlayerState({
        status: 'paused',
        currentPositionMs: playerState.currentPositionMs,
        currentDurationMs: playerState.currentDurationMs,
      });
    },
    [playerState, cleanupListeners],
  );

  /**
   * 재생 정지 (playing/paused → ready)
   */
  const stopPlay = useCallback(
    async function () {
      if (playerState.status !== 'playing' && playerState.status !== 'paused') {
        return;
      }

      // 리스너 비활성화
      shouldUpdateFromListenerRef.current = false;

      // 네이티브 정지
      Sound.stopPlayer();
      cleanupListeners();

      // 상태 전이: playing/paused → ready (위치 초기화)
      setPlayerState({
        status: 'ready',
        currentDurationMs: playerState.currentDurationMs,
      });
    },
    [playerState, cleanupListeners],
  );

  /**
   * 재생 위치 이동
   */
  const seekPlay = useCallback(async (seconds: number) => {
    Sound.seekToPlayer(seconds);
  }, []);

  /**
   * 기존 오디오 파일의 duration을 로드
   * 짧게 재생 후 즉시 멈춰서 duration 정보만 얻기
   */
  const loadDuration = useCallback(
    async (audioPath: string) => {
      if (!audioPath || isLoadingDuration) {
        return;
      }

      try {
        setIsLoadingDuration(true);

        // 임시 리스너로 duration만 얻기
        const tempListener = (e: { duration: number }) => {
          const durationMs = e.duration;

          // duration 정보를 ready 상태로 설정
          setPlayerState({
            status: 'ready',
            currentDurationMs: durationMs,
          });

          // 즉시 재생 중지
          Sound.stopPlayer();
          Sound.removePlayBackListener();
          setIsLoadingDuration(false);
        };

        // 재생 시작 (duration을 얻기 위해)
        Sound.addPlayBackListener(tempListener);
        await Sound.startPlayer(audioPath);
      } catch (error) {
        logger.error('Failed to load duration:', error);
        setIsLoadingDuration(false);
      }
    },
    [isLoadingDuration],
  );

  // audioUrl이 변경되면 file 업데이트 및 duration 로드 (한 번만)
  useEffect(() => {
    // audioUrl이 없거나 이미 초기화된 경우 스킵
    if (!audioUrl || initializedAudioRef.current === audioUrl) {
      return;
    }

    // 초기화 표시
    initializedAudioRef.current = audioUrl;
    setFile(audioUrl);

    // idle 또는 ready 상태일 때만 초기화 (재생/일시정지 중이 아닐 때)
    if (playerState.status === 'idle' || playerState.status === 'ready') {
      if (initialDurationSeconds) {
        setPlayerState({
          status: 'ready',
          currentDurationMs: initialDurationSeconds * 1000,
        });
      } else {
        loadDuration(audioUrl);
      }
    }
  }, [audioUrl, initialDurationSeconds]);

  return {
    fileName: file,
    recordTime,
    isRecording: playerState.status === 'recording',
    playInfo: getPlayInfo(),
    startRecord,
    stopRecord,
    startPlay,
    pausePlay,
    stopPlay,
    seekPlay,
    resetPlayInfo,
  };
};
