import {Color, LegacyColor} from '../../constants/color.constant.ts';
import React, {useEffect, useState} from 'react';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {Dimensions, Pressable, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {XXSmallText} from '../styled/components/LegacyText.tsx';
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
  editable?: boolean;
  onClose?: () => void;
};

export const VoicePlayer = ({
  source,
  onSave,
  onDelete,
  editable = true,
  onClose,
}: props) => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const resetPlayInfo = useResetRecoilState(playInfoState);
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);

  const [audioUri, setAudioUri] = useState<string | undefined>(source);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      isRecording && stopRecord();
      stopPlay();
      resetPlayInfo();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);
  const DeviceWidth = Dimensions.get('window').width;

  const {isRecording, startRecord, stopRecord, startPlay, pausePlay, stopPlay} =
    useVoiceRecorder({
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
                      playInfo.currentPositionSec && playInfo.currentDurationSec
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
        <DeleteButton
          visiable={audioUri != undefined && editable}
          onPress={onRemove}></DeleteButton>
        {audioUri ? (
          playInfo.isPlay ? (
            <PauseButton onPress={pausePlay}></PauseButton>
          ) : (
            <PlayButton onPress={startPlay}></PlayButton>
          )
        ) : isRecording ? (
          <StopButton
            onPress={() => {
              setProgress(0);
              setWaveData(initWaveData);

              stopRecord();
            }}></StopButton>
        ) : (
          <RecordButton onPress={startRecord}></RecordButton>
        )}
        <CheckButton
          visiable={audioUri !== undefined && editable && source !== audioUri}
          onPress={() => {
            stopPlay();
            onSave(audioUri);
            onClose && onClose();
          }}></CheckButton>
      </ContentContainer>
    </>
  );
};
