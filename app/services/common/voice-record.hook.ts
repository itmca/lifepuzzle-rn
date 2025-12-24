import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';
import Sound from 'react-native-nitro-sound';
import { useCallback, useEffect, useState } from 'react';

import {
  PlayInfo,
  VoiceRecorderHookProps,
  VoiceRecorderHookReturn,
} from '../../types/voice/voice-player.type';
import { getRecordFileName, getDisplayRecordTime } from './voice-record.util';

/**
 * 음성 녹음 및 재생 관리 Custom Hook
 *
 * @description
 * 음성 녹음, 재생, 일시정지, 정지 등의 기능을 제공합니다.
 * PlayInfo를 로컬 상태로 관리하여 컴포넌트 독립성을 보장합니다.
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
  onStartRecord,
  onStopRecord,
}: VoiceRecorderHookProps): VoiceRecorderHookReturn => {
  // Local state (PlayInfo를 로컬로 관리)
  const [playInfo, setPlayInfo] = useState<PlayInfo>({});
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState<string>(audioUrl ?? '');
  const [recordTime, setRecordTime] = useState<string>('00:00:00');
  const [isLoadingDuration, setIsLoadingDuration] = useState(false);

  /**
   * PlayInfo 초기화
   */
  const resetPlayInfo = useCallback(() => {
    setPlayInfo({});
  }, []);

  /**
   * 녹음 시작
   */
  const startRecord = useCallback(
    async function () {
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

      // 녹음 시작 전 준비
      await stopPlay();
      resetPlayInfo();

      // 네이티브 녹음 시작 (await으로 완료 대기)
      const uri = await Sound.startRecorder(path, audioSet);

      // 녹음이 실제로 시작된 후 UI 상태 업데이트
      setIsRecording(true);
      setFile(uri);

      // 녹음 진행 상황 리스너 등록
      Sound.addRecordBackListener(e => {
        const hourMinuteSeconds = getDisplayRecordTime(
          Math.floor(e.currentPosition),
        );
        setRecordTime(hourMinuteSeconds);
        setPlayInfo({
          currentDurationSec: e.currentPosition,
          duration: Sound.mmssss(Math.floor(e.currentPosition)),
        });
      });

      onStartRecord?.();
    },
    [onStartRecord, resetPlayInfo],
  );

  /**
   * 녹음 종료
   */
  const stopRecord = useCallback(
    async function () {
      // 네이티브 녹음 중지 (await으로 완료 대기)
      await Sound.stopRecorder();
      Sound.removeRecordBackListener();

      // 녹음이 실제로 중지된 후 UI 상태 업데이트
      setIsRecording(false);
      setPlayInfo({ isPlay: false });

      onStopRecord?.(file);
    },
    [file, onStopRecord],
  );

  /**
   * 재생 시작
   */
  const startPlay = useCallback(async () => {
    setPlayInfo({ isPlay: true });
    const msg = await Sound.startPlayer(file);
    Sound.addPlayBackListener(e => {
      setPlayInfo({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: Sound.mmssss(Math.floor(e.currentPosition)),
        duration: Sound.mmssss(Math.floor(e.duration)),
      });
      if (e.currentPosition == e.duration) {
        setPlayInfo({ isPlay: false });
        stopPlay();
      }
    });
  }, [file]);

  /**
   * 재생 일시정지
   */
  const pausePlay = useCallback(async () => {
    await Sound.pausePlayer();
    setPlayInfo({ isPlay: false });
  }, []);

  /**
   * 재생 정지
   */
  const stopPlay = useCallback(async () => {
    Sound.stopPlayer();
    Sound.removePlayBackListener();
    setPlayInfo({ isPlay: false });
  }, []);

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

        // 재생 시작 (duration을 얻기 위해)
        await Sound.startPlayer(audioPath);

        // playback listener를 통해 duration 정보 얻기
        Sound.addPlayBackListener(e => {
          const durationSec = e.duration;
          const durationStr = Sound.mmssss(Math.floor(durationSec));

          // duration 정보를 playInfo에 설정
          setPlayInfo(prev => ({
            ...prev,
            currentDurationSec: durationSec,
            duration: durationStr,
          }));

          // 즉시 재생 중지
          Sound.stopPlayer();
          Sound.removePlayBackListener();
          setIsLoadingDuration(false);
        });
      } catch (error) {
        setIsLoadingDuration(false);
      }
    },
    [isLoadingDuration],
  );

  // audioUrl이 변경되면 duration 로드
  useEffect(() => {
    if (audioUrl && !isRecording) {
      setFile(audioUrl);
      loadDuration(audioUrl);
    }
  }, [audioUrl, isRecording, loadDuration]);

  return {
    fileName: file,
    recordTime,
    isRecording,
    playInfo,
    startRecord,
    stopRecord,
    startPlay,
    pausePlay,
    stopPlay,
    seekPlay,
    resetPlayInfo,
  };
};
