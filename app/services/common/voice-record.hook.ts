import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform } from 'react-native';
import Sound from 'react-native-nitro-sound';

import { useState } from 'react';
import { useStoryStore } from '../../stores/story.store.ts';
// Voice record utility functions (integrated from voice-record-info.service.ts)
const getRecordFileName = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const minute = date.getMinutes();

  const tempHour = date.getHours();
  // Fixed hour calculation logic
  const hour = tempHour === 0 ? 12 : tempHour > 12 ? tempHour - 12 : tempHour;
  const hourUnit = tempHour < 12 ? 'AM' : 'PM';

  const fileName = `${year}${month}${day}_${hour}${minute}${hourUnit}`;
  return fileName;
};

const getDisplayRecordTime = (milliSeconds: number): string => {
  const seconds = Math.floor((milliSeconds / 1000) % 60);
  const minute = Math.floor((milliSeconds / 60000) % 60);
  const hour = Math.floor((milliSeconds / 3600000) % 60);

  const hourMinuteSeconds =
    hour.toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
    ':' +
    minute.toLocaleString('en-US', { minimumIntegerDigits: 2 }) +
    ':' +
    seconds.toLocaleString('en-US', { minimumIntegerDigits: 2 });

  return hourMinuteSeconds;
};

interface VoiceRecorderProps {
  audioUrl?: string;
  onStartRecord?: () => void;
  onStopRecord?: (uri: string) => void;
}

interface VoiceRecorderReturn {
  fileName: string | undefined;
  recordTime: string | undefined;
  isRecording: boolean;
  startRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
  startPlay: () => Promise<void>;
  pausePlay: () => Promise<void>;
  stopPlay: () => Promise<void>;
  seekPlay: (seconds: number) => Promise<void>;
}

export const useVoiceRecorder = ({
  audioUrl,
  onStartRecord,
  onStopRecord,
}: VoiceRecorderProps): VoiceRecorderReturn => {
  const resetPlayInfo = useStoryStore(state => state.resetPlayInfo);

  const setPlayInfo = useStoryStore(state => state.setPlayInfo);
  const [isRecording, setIsRecording] = useState(false);

  const [file, setFile] = useState<string>(audioUrl ?? '');
  const [recordTime, setRecordTime] = useState<string>('00:00:00');

  const startRecord = async function () {
    const fileName = getRecordFileName();
    const dirs = ReactNativeBlobUtil.fs.dirs;
    const path = Platform.select({
      ios: `${fileName}.m4a`,
      android: `${dirs.CacheDir}/${fileName}.mp4`,
    });
    const audioSet = {
      AudioSamplingRate: 44100,
      AudioEncodingBitRate: 128000,
      AudioChannels: 1,
    };
    stopPlay();
    resetPlayInfo();
    setIsRecording(true);

    const uri = await Sound.startRecorder(path, audioSet);

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

    setFile(uri);
    onStartRecord?.();
  };

  const stopRecord = async function () {
    await Sound.stopRecorder();
    Sound.removeRecordBackListener();

    setIsRecording(false);
    setPlayInfo({ isPlay: false });
    onStopRecord?.(file);
  };
  const startPlay = async () => {
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

        stopRecord();
      }
    });
  };

  const pausePlay = async () => {
    await Sound.pausePlayer();
    setPlayInfo({ isPlay: false });
  };

  const stopPlay = async () => {
    Sound.stopPlayer();
    Sound.removePlayBackListener();
    setPlayInfo({ isPlay: false });
  };
  const seekPlay = async (seconds: number) => {
    Sound.seekToPlayer(seconds);
  };
  return {
    fileName: file,
    recordTime,
    isRecording,
    startRecord,
    stopRecord,
    startPlay,
    pausePlay,
    stopPlay,
    seekPlay,
  };
};
