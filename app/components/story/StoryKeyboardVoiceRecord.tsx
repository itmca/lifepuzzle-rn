import {TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {MediumText, SmallText, XSmallText} from '../styled/components/Text';
import {useRecoilState} from 'recoil';
import {
  writingRecordTimeState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {XSmallImage} from '../styled/components/Image';
import TouchableRipple from 'react-native-paper/src/components/TouchableRipple/TouchableRipple';
import {Color} from '../../constants/color.constant';
import {BasicNavigationProps} from '../../navigation/types';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
import Icon from '../styled/components/Icon';
import {CustomAlert} from '../alert/CustomAlert';
import Sound from 'react-native-sound';
import {getDisplayRecordTime} from '../../service/voice-record-info.service';

type VoiceRecordProps = {
  recordTime: string;
  onDelete: () => void;
};

const RecordedVoice = ({
  recordTime,
  onDelete,
}: VoiceRecordProps): JSX.Element => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        backgroundColor: Color.PRIMARY_LIGHT,
        borderRadius: 5,
        width: 88,
        height: 32,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginRight: -8,
      }}
      onPress={() => {
        CustomAlert.actionAlert({
          title: '음성 녹음 삭제',
          desc: '음성 녹음을 삭제하시겠습니까?',
          actionBtnText: '삭제',
          action: () => {
            onDelete();
          },
        });
      }}>
      <View
        style={{
          backgroundColor: Color.WHITE,
          borderRadius: 16,
          width: 18,
          height: 18,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <XSmallImage
          style={{
            width: 12,
            height: 12,
            tintColor: Color.PRIMARY_LIGHT,
          }}
          source={require('../../assets/images/mic.png')}
        />
      </View>
      <XSmallText color={Color.WHITE}>
        {recordTime.substring(recordTime.indexOf(':') + 1)}
      </XSmallText>
      <Icon name={'cancel'} size={16} style={{color: Color.WHITE}} />
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
        <HorizontalContentContainer
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <MediumText style={{paddingLeft: 16}}>
            녹음본 업로드 <SmallText color={Color.DARK_GRAY}>(선택)</SmallText>
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
        </HorizontalContentContainer>
      </TouchableRipple>
    </>
  );
};
