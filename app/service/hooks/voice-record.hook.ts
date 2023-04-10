import RNFetchBlob from "rn-fetch-blob";
import {Platform} from "react-native";
import AudioRecorderPlayer, {
    AudioEncoderAndroidType,
    AudioSourceAndroidType,
    AVEncoderAudioQualityIOSType, AVEncodingOption,
    AVModeIOSOption, RecordBackType
} from "react-native-audio-recorder-player";
import {VoiceRecordInfo} from "../../types/writing-story.type";
import {useRecoilState} from "recoil";
import {recordFileState} from "../../recoils/story-writing.recoil";
import {useEffect, useState} from "react";
import {getDisplayRecordTime, getRecordFileName} from "../voice-record-info.service";

type Props = {
    onStartRecord?: () => void;
    onStopRecord?: () => void;
}

type Response = {
    recordFile: VoiceRecordInfo | undefined,
    isRecording: boolean,
    startRecord: () => Promise<void>,
    stopRecord: () => Promise<void>,
}

const audioRecorderPlayer = new AudioRecorderPlayer();
export const useVoiceRecorder = ({onStartRecord, onStopRecord}: Props): Response => {
    const [recordFile, setRecordFile] = useRecoilState(recordFileState);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        setRecordFile({filePath: undefined, recordTime: undefined});
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
            const HourMinuteSeconds = getDisplayRecordTime(
                Math.floor(e.currentPosition),
            );

            setRecordFile({
                filePath: uri,
                recordTime: HourMinuteSeconds,
            });
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
        recordFile,
        isRecording,
        startRecord,
        stopRecord,
    }
};