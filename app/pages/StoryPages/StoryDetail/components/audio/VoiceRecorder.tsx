import { Color } from '../../../../../constants/color.constant.ts';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { ContentContainer } from '../../../../../components/ui/layout/ContentContainer';
import { Dimensions, View } from 'react-native';
import {
  CheckButton,
  DeleteButton,
  PauseButton,
  PlayButton,
  RecordButton,
  StopButton,
} from './VoiceControlButtons';
import { Caption } from '../../../../../components/ui/base/TextBase';
import { useVoiceRecorder } from '../../../../../services/common/voice-record.hook.ts';
import { Waveform } from './WaveForm';
import {
  VoiceRecorderProps,
  VoiceRecorderRef,
} from '../../../../../types/voice/voice-player.type';

const initWaveData = [
  0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.8, 0.3, 0.5,
  0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.9, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5,
  0.4, 0.2, 0.6, 0.3, 0.6, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 1.0,
  0.7, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.8,
  0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4,
];

export const VoiceRecorder = forwardRef<VoiceRecorderRef, VoiceRecorderProps>(
  (
    { source, onSave, onDelete, editable = true, onClose, isUploading },
    ref,
  ) => {
    // React hooks
    const [audioUri, setAudioUri] = useState<string | undefined>(source);
    const [waveData, setWaveData] = useState<number[]>(initWaveData);
    const [progress, setProgress] = useState(0);
    const [isPlayLoading, setIsPlayLoading] = useState(false);

    // Custom hooks
    const {
      isRecording,
      playInfo,
      startRecord,
      stopRecord,
      startPlay,
      pausePlay,
      stopPlay,
      resetPlayInfo,
    } = useVoiceRecorder({
      audioUrl: audioUri,
      onStopRecord: (url: string) => {
        setAudioUri(url);
      },
    });

    // Custom functions
    const stopAllAudio = () => {
      if (isRecording) {
        stopRecord();
      }
      if (playInfo.isPlay) {
        stopPlay();
      }
      resetPlayInfo();
    };

    useImperativeHandle(ref, () => ({
      stopAllAudio,
    }));

    const DeviceWidth = Dimensions.get('window').width;

    // 새로 녹음한 경우 판단 (전송 버튼 표시 조건과 동일)
    const isNewRecording = !!audioUri && editable && source !== audioUri;

    const onRemove = () => {
      stopPlay();
      resetPlayInfo();

      setAudioUri(undefined);

      // 새로 녹음한 게 아니면 (기존 저장된 음성이면) 서버 삭제
      if (!isNewRecording) {
        onDelete?.();
      }
    };

    const handlePlayStart = async () => {
      setIsPlayLoading(true);
      try {
        await startPlay();
      } finally {
        setIsPlayLoading(false);
      }
    };

    // Side effects
    useEffect(() => {
      const randomHeight = Math.random();
      setWaveData(prev => [...prev, randomHeight].slice(-50));
      setProgress(Math.min((playInfo.currentDurationSec ?? 0) / 10000, 1));
    }, [playInfo.currentDurationSec]);

    return (
      <>
        <ContentContainer gap={9}>
          <ContentContainer height={24} justifyContent="flex-end">
            {isRecording ? (
              <Waveform data={waveData} progress={progress} />
            ) : (
              <View
                style={{
                  backgroundColor: Color.GREY,
                  height: 6,
                  alignSelf: 'stretch',
                  borderRadius: 100,
                }}
              >
                <View
                  style={{
                    backgroundColor: Color.MAIN,
                    height: 6,
                    alignSelf: 'stretch',
                    borderRadius: 100,
                    width:
                      playInfo.currentPositionSec && playInfo.currentDurationSec
                        ? (playInfo.currentPositionSec /
                            playInfo.currentDurationSec) *
                          DeviceWidth
                        : 0,
                  }}
                />
              </View>
            )}
          </ContentContainer>
          <ContentContainer useHorizontalLayout>
            <Caption color={editable ? Color.GREY_300 : Color.GREY_800}>
              {playInfo.playTime
                ? playInfo.playTime.substring(
                    0,
                    playInfo.playTime.lastIndexOf(':'),
                  )
                : '00:00'}
            </Caption>
            <Caption
              color={audioUri || isRecording ? Color.GREY_800 : Color.GREY_300}
            >
              {playInfo.duration
                ? playInfo.duration.substring(
                    0,
                    playInfo.duration.lastIndexOf(':'),
                  )
                : '00:00'}
            </Caption>
          </ContentContainer>
        </ContentContainer>
        <ContentContainer useHorizontalLayout height={64} alignCenter gap={28}>
          <DeleteButton
            visiable={Boolean(audioUri && editable)}
            onPress={onRemove}
          />
          {audioUri ? (
            playInfo.isPlay ? (
              <PauseButton onPress={pausePlay} />
            ) : (
              <PlayButton onPress={handlePlayStart} loading={isPlayLoading} />
            )
          ) : isRecording ? (
            <StopButton
              onPress={() => {
                setProgress(0);
                setWaveData(initWaveData);

                stopRecord();
              }}
            />
          ) : (
            <RecordButton onPress={startRecord} />
          )}
          <CheckButton
            visiable={isNewRecording}
            disabled={isUploading}
            loading={isUploading}
            onPress={() => {
              stopPlay();
              onSave(audioUri ?? '');
            }}
          />
        </ContentContainer>
      </>
    );
  },
);
