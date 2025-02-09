import {TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  MediumText,
  SmallText,
  XSmallText,
} from '../styled/components/LegacyText.tsx';
import {useRecoilState} from 'recoil';
import {
  writingRecordTimeState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import TouchableRipple from 'react-native-paper/src/components/TouchableRipple/TouchableRipple';
import {LegacyColor} from '../../constants/color.constant';
import {BasicNavigationProps} from '../../navigation/types';
import {ContentContainer} from '../styled/container/ContentContainer';
import Icon from '../styled/components/Icon';
import Sound from 'react-native-sound';
import {getDisplayRecordTime} from '../../service/voice-record-info.service';

import Ionicons from 'react-native-vector-icons/Ionicons';
type VoiceRecordProps = {
  recordTime: string;
  onDelete?: () => void;
};

export const RecordedVoice = ({
  recordTime = '00:00:00',
  onDelete,
}: VoiceRecordProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        width: 70,
        height: 32,
        backgroundColor: LegacyColor.PRIMARY_LIGHT,
        borderRadius: 5,
        padding: 8,
      }}>
      <ContentContainer
        useHorizontalLayout
        gap={4}
        backgroundColor={'transparent'}>
        <ContentContainer
          width={'16px'}
          height={'16px'}
          alignItems="center"
          justifyContent="center"
          backgroundColor={LegacyColor.WHITE}
          borderRadius={16}>
          <Ionicons
            size={13}
            color={LegacyColor.PRIMARY_LIGHT}
            name={'mic-outline'}
          />
        </ContentContainer>
        <ContentContainer backgroundColor={'transparent'}>
          <XSmallText color={LegacyColor.WHITE}>
            {recordTime.substring(0, recordTime.lastIndexOf(':'))}
          </XSmallText>
          {onDelete ? (
            <Icon
              name={'cancel'}
              size={16}
              style={{color: LegacyColor.WHITE}}
            />
          ) : (
            <></>
          )}
        </ContentContainer>
      </ContentContainer>
    </TouchableOpacity>
  );
};

export const StoryKeyboardVoiceRecord = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [recordTime, setRecordTime] = useRecoilState(writingRecordTimeState);

  useEffect(() => {
    if (writingStory.voice && !recordTime) {
      Sound.setCategory('Playback');
      const audioSound = new Sound(writingStory.voice, undefined, error => {
        if (error) {
          return;
        }

        setRecordTime(getDisplayRecordTime(audioSound.getDuration() * 1000));
      });
    }
  }, [writingStory]);

  const hasRecordFile = function () {
    return !!writingStory?.voice;
  };

  return (
    <>
      <TouchableRipple
        style={{
          paddingVertical: 8,
          paddingRight: 24,
          alignItems: 'center',
        }}
        onPress={() =>
          hasRecordFile() ? (
            <></>
          ) : (
            navigation.push('NoTab', {
              screen: 'StoryWritingNavigator',
              params: {
                screen: 'StoryWritingVoice',
              },
            })
          )
        }>
        <ContentContainer
          useHorizontalLayout
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <MediumText style={{paddingLeft: 16}}>
            녹음본 업로드{' '}
            <SmallText color={LegacyColor.DARK_GRAY}>(선택)</SmallText>
          </MediumText>
          <View
            style={{
              marginVertical: 6,
            }}>
            {hasRecordFile() ? (
              <RecordedVoice
                recordTime={recordTime}
                onDelete={() => {
                  setWritingStory({voice: undefined});
                }}
              />
            ) : (
              <View style={{height: 32}} />
            )}
          </View>
        </ContentContainer>
      </TouchableRipple>
    </>
  );
};
