import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useRecoilState, useResetRecoilState} from 'recoil';

import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {Alert, Pressable, View} from 'react-native';
import styles from './styles';
import {useVoicePermission} from '../../service/hooks/permission.hook';
import {useVoiceRecorder} from '../../service/hooks/voice-record.hook';

import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {XXXLargeText} from '../../components/styled/components/Text';
import CtaButton from '../../components/button/CtaButton';
import {VoicePlayer} from '../../components/story/StoryVoicePlayer';

const StoryWritingVoicePage = (): JSX.Element => {
  const navigation = useNavigation();
  const [numberOfLines, setNumberOfLines] = useState<number>(0);
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const resetPlayInfo = useResetRecoilState(playInfoState);
  const helpQuestion = writingStory?.helpQuestionText || '';
  const ishelpQuestionVisible = helpQuestion.length != 0;

  useVoicePermission({
    onDeny: () => {
      Alert.alert('마이크 권한이 없습니다.', '', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    },
  });
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      setPlayInfo({isPlay: false, playTime: '00:00:00', currentPositionSec: 0});
      stopPlay();
    }
  }, [isFocused]);
  const {
    fileName,
    recordTime = '00:00',
    isRecording,
    startRecord,
    stopRecord,
    startPlay,
    pausePlay,
    stopPlay,
    seekPlay,
  } = useVoiceRecorder({
    onStartRecord: () => {},
    onStopRecord: () => {
      setWritingStory({voice: fileName});
    },
  });
  const disable = !writingStory.voice || isRecording;

  const onDelete = () => {
    stopPlay();
    setWritingStory({voice: undefined});
    resetPlayInfo();
  };

  return (
    <ScreenContainer>
      <ContentContainer flex={1} height={'100%'} withScreenPadding>
        <ContentContainer
          alignCenter
          alignItems={'center'}
          flex={1}
          height={'100%'}>
          <Pressable
            style={styles.recordContainer}
            onPress={() => {
              isRecording ? stopRecord() : startRecord();
            }}>
            <View
              style={isRecording ? styles.isRecordBox : styles.notIsRecordBox}
            />
          </Pressable>
          <XXXLargeText fontSize={40}>
            {recordTime
              ? recordTime.substring(recordTime?.indexOf(':') + 1)
              : '00:00'}
          </XXXLargeText>
        </ContentContainer>
        <ContentContainer withContentPadding>
          <VoicePlayer
            source={fileName}
            disable={disable}
            startPlay={startPlay}
            pausePlay={pausePlay}
            stopPlay={stopPlay}
            seekPlay={seekPlay}
            onDelete={onDelete}
          />
        </ContentContainer>
        <CtaButton
          active={!disable}
          disabled={disable}
          text={'녹음완료'}
          onPress={() => navigation.goBack()}
        />
      </ContentContainer>
    </ScreenContainer>
  );
};
export default StoryWritingVoicePage;
