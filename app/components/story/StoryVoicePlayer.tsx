import {Color} from '../../constants/color.constant.ts';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';

import {Dimensions, View} from 'react-native';
import {styles} from './styles.ts';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil.ts';
import {
  CheckButton,
  DeleteButton,
  PauseButton,
  PlayButton,
  RecordButton,
  StopButton,
} from '../button/AudioController.tsx';
import {Caption} from '../styled/components/Text.tsx';
import {useVoiceRecorder} from '../../service/hooks/voice-record.hook.ts';
import Waveform from './WaveForm.tsx';

type props = {
  source: string | undefined;
  onSave: (uri: string) => void;
  onDelete?: () => void;
  onClose?: () => void;
  editable?: boolean;
};
export type VoicePlayerRef = {
  stopAllAudio: () => void;
};
export const VoicePlayer = forwardRef<VoicePlayerRef, props>(
  ({source, onSave, onDelete, editable = true, onClose}, ref) => {
    const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
    const resetPlayInfo = useResetRecoilState(playInfoState);
    const [writingStory, setWritingStory] = useRecoilState(writingStoryState);

    const [audioUri, setAudioUri] = useState<string | undefined>(source);

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
    const {
      isRecording,
      startRecord,
      stopRecord,
      startPlay,
      pausePlay,
      stopPlay,
    } = useVoiceRecorder({
      audioUrl: audioUri,
      onStopRecord: (url: string) => {
        setAudioUri(url);
      },
    });
    const initWaveData = [
      0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.8, 0.3, 0.5,
      0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.9, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5,
      0.4, 0.2, 0.6, 0.3, 0.6, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 1.0,
      0.7, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4, 0.2, 0.8,
      0.3, 0.5, 0.4, 0.2, 0.6, 0.3, 0.5, 0.4,
    ];
    const [waveData, setWaveData] = useState<number[]>(initWaveData);
    const [progress, setProgress] = useState(0);
    const onRemove = () => {
      stopPlay();
      resetPlayInfo();
      setAudioUri(undefined);
      onDelete?.();
    };
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
              <View style={styles.viewBar}>
                <View
                  style={[
                    styles.viewBarPlay,
                    {
                      width:
                        playInfo.currentPositionSec &&
                        playInfo.currentDurationSec
                          ? (playInfo.currentPositionSec /
                              playInfo.currentDurationSec) *
                            DeviceWidth
                          : 0,
                    },
                  ]}
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
              color={audioUri || isRecording ? Color.GREY_800 : Color.GREY_300}>
              {playInfo.duration
                ? playInfo.duration.substring(
                    0,
                    playInfo.duration.lastIndexOf(':'),
                  )
                : '00:00'}
            </Caption>
          </ContentContainer>
        </ContentContainer>
        <ContentContainer
          useHorizontalLayout
          height={'64px'}
          alignCenter
          gap={28}>
          <DeleteButton visiable={audioUri && editable} onPress={onRemove} />
          {audioUri ? (
            playInfo.isPlay ? (
              <PauseButton onPress={pausePlay} />
            ) : (
              <PlayButton onPress={startPlay} />
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
            visiable={!!audioUri && editable && source !== audioUri}
            onPress={() => {
              stopPlay();
              onSave(audioUri ?? '');
              onClose && onClose();
            }}
          />
        </ContentContainer>
      </>
    );
  },
);
