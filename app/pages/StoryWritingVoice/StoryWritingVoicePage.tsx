import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil';

import {
  playingRecordInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import {useVoicePermission} from '../../service/hooks/permission.hook';
import {useVoiceRecorder} from '../../service/hooks/voice-record.hook';

import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import {List} from 'react-native-paper';
import {
  SmallText,
  LargeText,
  XXXLargeText,
  XXSmallText,
} from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';
import StoryDateInput from '../StoryWritingMain/StoryDateInput';
import {MediumImage} from '../../components/styled/components/Image';
import CtaButton from '../../components/button/CtaButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {CustomAlert} from '../../components/alert/CustomAlert';

const StoryWritingVoicePage = (): JSX.Element => {
  const navigation = useNavigation();

  const [numberOfLines, setNumberOfLines] = useState<number>(1);
  const [title, setTitle] = useState<string>('');
  const [storyText, setStoryText] = useState<string>('');
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [playInfo, setPlayInfo] = useRecoilState(playingRecordInfoState);
  const resetPlayInfo = useResetRecoilState(playingRecordInfoState);

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
    recordTime,
    isRecording,
    isPlaying,
    startRecord,
    stopRecord,
    startPlay,
    pausePlay,
    stopPlay,
    seekPlay,
  } = useVoiceRecorder({
    onStopRecord: () => {
      resetPlayInfo();
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
  const onStatusPress = (e: any): void => {
    const touchX = e.nativeEvent.locationX;
    const playWidth = playInfo?.currentDurationSec
      ? (playInfo?.currentPositionSec ?? 0 / playInfo?.currentDurationSec) *
        DeviceWidth
      : 0;
    const currentPosition = Math.round(playInfo?.currentPositionSec ?? 0);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      seekPlay(addSecs);
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      seekPlay(subSecs);
    }
  };
  const onReplay = () => {
    const currentPosition = Math.round(playInfo?.currentPositionSec ?? 0);
    const subSecs = Math.max(Math.round(currentPosition - 10000), 1);
    seekPlay(subSecs);
  };
  const onForward = () => {
    const currentPosition = Math.round(playInfo?.currentPositionSec ?? 0);
    const addSecs = Math.min(
      Math.round(currentPosition + 10000),
      playInfo?.currentDurationSec ?? 1,
    );
    seekPlay(addSecs);
  };
  const onDelete = () => {
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
            {writingStory.voice && recordTime
              ? recordTime.substring(recordTime?.indexOf(':') + 1)
              : '00:00'}
          </XXXLargeText>
        </ContentContainer>
        <ContentContainer>
          <ContentContainer useHorizontalLayout>
            <XXSmallText color={disable ? Color.FONT_GRAY : Color.BLACK}>
              {playInfo.playTime
                ? playInfo.playTime.substring(
                    0,
                    playInfo.playTime.lastIndexOf(':'),
                  )
                : '00:00'}
            </XXSmallText>
            <XXSmallText color={disable ? Color.FONT_GRAY : Color.BLACK}>
              {playInfo.duration
                ? playInfo.duration.substring(
                    0,
                    playInfo.duration.lastIndexOf(':'),
                  )
                : '00:00'}
            </XXSmallText>
          </ContentContainer>
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
        </ContentContainer>
        <ContentContainer
          withContentPadding
          useHorizontalLayout
          height={'80px'}>
          <Pressable disabled={disable} onPress={onReplay}>
            <MaterialIcons
              size={40}
              color={disable ? Color.FONT_GRAY : Color.BLACK}
              name={'replay-10'}
            />
          </Pressable>
          <Pressable
            disabled={disable}
            onPress={() => {
              isPlaying ? pausePlay() : startPlay();
            }}>
            <FontAwesome6
              size={40}
              color={disable ? Color.FONT_GRAY : Color.PRIMARY_LIGHT}
              name={isPlaying ? 'pause' : 'play'}
            />
          </Pressable>
          <Pressable disabled={disable} onPress={onForward}>
            <MaterialIcons
              size={40}
              color={disable ? Color.FONT_GRAY : Color.BLACK}
              name={'forward-10'}
            />
          </Pressable>
          <Pressable disabled={disable} onPress={onDelete}>
            <MaterialIcons
              size={40}
              color={disable ? Color.FONT_GRAY : Color.BLACK}
              name={'delete'}
            />
          </Pressable>
        </ContentContainer>
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
