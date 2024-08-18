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
import {useState} from 'react';
import {
  getDisplayRecordTime,
  getRecordFileName,
} from '../voice-record-info.service';
import {playInfoState} from '../../recoils/story-write.recoil';

type Props = {
  fileUrl?: string;
  onStartRecord?: () => void;
  onStopRecord?: () => void;
};

type Response = {
  fileName: string | undefined;
  recordTime: string | undefined;
  isRecording: boolean;
  startRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
  startPlay: (url?: string) => Promise<void>;
  pausePlay: () => Promise<void>;
  stopPlay: () => Promise<void>;
  seekPlay: (sec: number) => Promise<void>;
};

const audioRecorderPlayer = new AudioRecorderPlayer();
export const useVoiceRecorder = ({
  fileUrl,
  onStartRecord,
  onStopRecord,
}: Props): Response => {
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const [isRecording, setIsRecording] = useState(false);

  const [voiceUrl, setVoiceUrl] = useState<string>(fileUrl ?? '');
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

    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(e => {
      const hourMinuteSeconds = getDisplayRecordTime(
        Math.floor(e.currentPosition),
      );
      //setWritingStory({voice: uri});
      setRecordTime(hourMinuteSeconds);
    });
    setIsRecording(true);
    setPlayInfo({isPlay: false});

    setVoiceUrl(uri);
    onStartRecord?.();
  };

  const stopRecord = async function () {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();

    setIsRecording(false);
    setPlayInfo({isPlay: false});
    onStopRecord?.();
  };
  const startPlay = async (url?: string) => {
    setPlayInfo({isPlay: true});
    const msg = await audioRecorderPlayer.startPlayer(url ?? voiceUrl);
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
  const seekPlay = async (sec: number) => {
    audioRecorderPlayer.seekToPlayer(sec);
  };
  return {
    fileName: voiceUrl,
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
