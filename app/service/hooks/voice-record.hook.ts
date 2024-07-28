import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
} from 'react-native-audio-recorder-player';
import {useRecoilState} from 'recoil';
import {useEffect, useState} from 'react';
import {
  getDisplayRecordTime,
  getRecordFileName,
} from '../voice-record-info.service';
import {
  writingRecordTimeState,
  writingStoryState,
  playingRecordInfoState,
} from '../../recoils/story-write.recoil';

type Props = {
  onStartRecord?: () => void;
  onStopRecord?: () => void;
};

type Response = {
  fileName: string | undefined;
  recordTime: string | undefined;
  isRecording: boolean;
  isPlaying: boolean;
  startRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
  startPlay: (url?: string) => Promise<void>;
  pausePlay: () => Promise<void>;
  stopPlay: () => Promise<void>;
  seekPlay: (sec: number) => Promise<void>;
};

const audioRecorderPlayer = new AudioRecorderPlayer();
export const useVoiceRecorder = ({
  onStartRecord,
  onStopRecord,
}: Props): Response => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [recordTime, setRecordTime] = useRecoilState(writingRecordTimeState);

  const [playInfo, setPlayInfo] = useRecoilState(playingRecordInfoState);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    setWritingStory({voice: undefined});
    setRecordTime('');
  }, []);

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

    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(e => {
      const hourMinuteSeconds = getDisplayRecordTime(
        Math.floor(e.currentPosition),
      );
      setWritingStory({voice: uri});
      setRecordTime(hourMinuteSeconds);
    });
    setIsRecording(true);
    setIsPlaying(false);
    onStartRecord?.();
  };

  const stopRecord = async function () {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    setIsRecording(false);
    setIsPlaying(false);
    onStopRecord?.();
  };
  const startPlay = async (url?: string) => {
    setIsPlaying(true);
    const msg = await audioRecorderPlayer.startPlayer(
      url ?? writingStory.voice,
    );
    audioRecorderPlayer.addPlayBackListener(e => {
      setPlayInfo({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      if (e.currentPosition == e.duration) {
        setIsPlaying(false);
      }
      return;
    });
  };

  const pausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
    setIsPlaying(false);
  };

  const stopPlay = async () => {
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setIsPlaying(false);
  };
  const seekPlay = async (sec: number) => {
    audioRecorderPlayer.seekToPlayer(sec);
  };
  return {
    fileName: writingStory.voice,
    recordTime,
    isRecording,
    isPlaying,
    startRecord,
    stopRecord,
    startPlay,
    pausePlay,
    stopPlay,
    seekPlay,
  };
};
