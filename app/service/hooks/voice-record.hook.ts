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
} from '../../recoils/story-write.recoil';

type Props = {
  onStartRecord?: () => void;
  onStopRecord?: () => void;
};

type Response = {
  fileName: string | undefined;
  recordTime: string | undefined;
  isRecording: boolean;
  startRecord: () => Promise<void>;
  stopRecord: () => Promise<void>;
};

const audioRecorderPlayer = new AudioRecorderPlayer();
export const useVoiceRecorder = ({
  onStartRecord,
  onStopRecord,
}: Props): Response => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [recordTime, setRecordTime] = useRecoilState(writingRecordTimeState);
  const [isRecording, setIsRecording] = useState(false);

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
    onStartRecord?.();
  };

  const stopRecord = async function () {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    onStopRecord?.();
  };

  return {
    fileName: writingStory.voice,
    recordTime,
    isRecording,
    startRecord,
    stopRecord,
  };
};
