import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useRecoilState, useResetRecoilState} from 'recoil';

import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {Alert, Dimensions, Pressable, View} from 'react-native';
import styles from './styles';
import {useVoicePermission} from '../../service/hooks/permission.hook';
import {useVoiceRecorder} from '../../service/hooks/voice-record.hook';

import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {List} from 'react-native-paper';
import {LargeText, XXXLargeText} from '../../components/styled/components/Text';
import StoryDateInput from '../StoryWritingMain/StoryDateInput';
import {MediumImage} from '../../components/styled/components/Image';
import CtaButton from '../../components/button/CtaButton';
import {CustomAlert} from '../../components/alert/CustomAlert';
import {VoicePlayer} from '../../components/story/StoryVoicePlayer';

const StoryWritingVoicePage = (): JSX.Element => {
  const navigation = useNavigation();
  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
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
  const DeviceWidth = Dimensions.get('window').width;
  const disable = !writingStory.voice || isRecording;
  const nextPage = () => {
    navigation.push('NoTab', {
      screen: 'StoryWritingNavigator',
      params: {
        screen: 'StoryWritingMain',
      },
    });
  };

  const onDelete = () => {
    stopPlay();
    setWritingStory({voice: undefined});
    resetPlayInfo();
  };
  return (
    <ScreenContainer>
      <ContentContainer flex={1} height={'100%'} withScreenPadding>
        <ContentContainer>
          <StoryDateInput
            value={writingStory.date}
            onChange={(date: Date) => {
              setWritingStory({date});
            }}></StoryDateInput>
          {ishelpQuestionVisible ? (
            <>
              <List.Accordion
                title={<LargeText fontWeight={700}>{helpQuestion}</LargeText>}
                right={() => <></>}
                onPress={() => {
                  numberOfLines == 1
                    ? setNumberOfLines(0)
                    : setNumberOfLines(1);
                }}
                titleNumberOfLines={numberOfLines}
                titleStyle={{marginLeft: -5}}
                style={styles.helpQuestionContainer}
                theme={{
                  colors: {background: 'transparent'},
                }}
              />
              <MediumImage
                width={32}
                height={32}
                source={require('../../assets/images/puzzle-character.png')}
                style={{position: 'absolute', top: 15, right: 20}}
              />
            </>
          ) : (
            <></>
          )}
        </ContentContainer>
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
              style={
                isRecording ? styles.isRecordBox : styles.notIsRecordBox
              }></View>
          </Pressable>
          <XXXLargeText fontSize={40}>
            {recordTime
              ? recordTime.substring(recordTime?.indexOf(':') + 1)
              : '00:00'}
          </XXXLargeText>
        </ContentContainer>
        <VoicePlayer
          source={fileName}
          disable={disable}
          startPlay={startPlay}
          pausePlay={pausePlay}
          stopPlay={stopPlay}
          seekPlay={seekPlay}
          onDelete={onDelete}></VoicePlayer>
        <CtaButton
          active={!disable}
          disabled={disable}
          text={'녹음완료'}
          onPress={nextPage}
        />
        <CtaButton
          outlined
          text={'음성녹음 없이 진행하기'}
          onPress={() => {
            if (writingStory.voice) {
              CustomAlert.actionAlert({
                title: '녹음이 삭제됩니다. 음성녹음 없이 진행하시겠습니까?',
                desc: '',
                actionBtnText: '확인',
                action: () => {
                  onDelete();
                  nextPage();
                },
              });
            } else {
              nextPage();
            }
          }}
        />
      </ContentContainer>
    </ScreenContainer>
  );
};
export default StoryWritingVoicePage;
