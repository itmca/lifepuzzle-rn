import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {useState} from 'react';
import {
  getDisplayRecordTime,
  getRecordFileName,
} from '../voice-record-info.service';
import {playInfoState} from '../../recoils/content/story.recoil';

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

const audioRecorderPlayer = new AudioRecorderPlayer();
export const useVoiceRecorder = ({
  audioUrl,
  onStartRecord,
  onStopRecord,
}: VoiceRecorderProps): VoiceRecorderReturn => {
  const resetPlayInfo = useResetRecoilState(playInfoState);

  const setPlayInfo = useSetRecoilState(playInfoState);
  const [isRecording, setIsRecording] = useState(false);

  const [file, setFile] = useState<string>(audioUrl ?? '');
  const [recordTime, setRecordTime] = useState<string>('00:00:00');

  const startRecord = async function () {
    const fileName = getRecordFileName();
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: `${fileName}.m4a`,
      android: `${dirs.CacheDir}/${fileName}.mp4`,
    });
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVModeIOS: AVModeIOSOption.measurement,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    stopPlay();
    resetPlayInfo();
    setIsRecording(true);

    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener(e => {
      const hourMinuteSeconds = getDisplayRecordTime(
        Math.floor(e.currentPosition),
      );
      setRecordTime(hourMinuteSeconds);
      setPlayInfo({
        currentDurationSec: e.currentPosition,
        duration: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
    });

    setFile(uri);
    onStartRecord?.();
  };

  const stopRecord = async function () {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    setIsRecording(false);
    setPlayInfo({isPlay: false});
    onStopRecord?.(file);
  };
  const startPlay = async () => {
    setPlayInfo({isPlay: true});
    const msg = await audioRecorderPlayer.startPlayer(file);
    audioRecorderPlayer.addPlayBackListener(e => {
      setPlayInfo({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      if (e.currentPosition == e.duration) {
        setPlayInfo({isPlay: false});

        stopRecord();
      }
    });
  };

  const pausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    setPlayInfo({isPlay: false});
  };

  const stopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayInfo({isPlay: false});
  };
  const seekPlay = async (seconds: number) => {
    audioRecorderPlayer.seekToPlayer(seconds);
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
