import React from 'react';
import {Keyboard, Pressable, TouchableOpacity} from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {LegacyColor} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import MediumText from '../styled/components/LegacyText.tsx';
import {RecordedVoice} from './StoryKeyboardVoiceRecord';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {SmallImage} from '../styled/components/Image.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CustomAlert} from '../alert/CustomAlert.tsx';

type MenuProps = {
  type: 'bar' | 'list';
};
type Props = {
  showText?: boolean;
  onClick?: void;
};
export const StoryWritingMenuItem = ({type}: MenuProps): JSX.Element => {
  const writingStory = useRecoilValue(writingStoryState);
  const playVoice = !!writingStory.voice;
  return type === 'list' ? (
    <>{playVoice ? <PlayVoice showText /> : <RecordVoice showText />}</>
  ) : (
    <ContentContainer
      withScreenPadding
      useHorizontalLayout
      justifyContent="space-around">
      {playVoice ? <PlayVoice /> : <RecordVoice />}
    </ContentContainer>
  );
};

const PlayVoice = ({showText = false}: Props): JSX.Element => {
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const resetPlayInfo = useResetRecoilState(playInfoState);
  const setWritingStory = useSetRecoilState(writingStoryState);

  return (
    <Pressable
      onPressIn={() => {
        Keyboard.dismiss();
      }}
      onPress={() => {
        setPlayInfo({isOpen: true});
      }}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="space-between"
          paddingHorizontal={20}
          paddingVertical={12}>
          <ContentContainer width={'32px'} alignCenter>
            <FontAwesome6
              size={30}
              color={LegacyColor.PRIMARY_LIGHT}
              name={'play'}
            />
          </ContentContainer>
          <ContentContainer flex={1}>
            <MediumText>음성 재생</MediumText>
          </ContentContainer>
          <RecordedVoice recordTime={playInfo.duration ?? '00:00:00'} />
          <TouchableOpacity
            onPress={() => {
              CustomAlert.actionAlert({
                title: '음성 파일을 삭제하시겠습니까?',
                desc: '',
                actionBtnText: '삭제',
                action: () => {
                  setWritingStory({voice: undefined});
                  resetPlayInfo();
                },
              });
            }}>
            <Icon size={24} name={'delete'} />
          </TouchableOpacity>
        </ContentContainer>
      ) : (
        <FontAwesome6
          size={30}
          color={LegacyColor.PRIMARY_LIGHT}
          name={'play'}
        />
      )}
    </Pressable>
  );
};

const RecordVoice = ({showText = false}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <Pressable
      onPressIn={() => {
        Keyboard.dismiss();
      }}
      onPress={() => {
        navigation.navigate('NoTab', {
          screen: 'StoryWritingNavigator',
          params: {
            screen: 'StoryWritingVoice',
          },
        });
      }}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="space-between"
          paddingHorizontal={20}
          paddingVertical={12}>
          <ContentContainer width={'32px'} alignCenter>
            <SmallImage
              height={32}
              width={32}
              source={require('../../assets/images/voide-recod-icon.png')}
            />
          </ContentContainer>
          <ContentContainer flex={1}>
            <MediumText>음성 녹음</MediumText>
          </ContentContainer>
        </ContentContainer>
      ) : (
        <FontAwesome6
          size={30}
          color={LegacyColor.PRIMARY_LIGHT}
          name={'play'}
        />
      )}
    </Pressable>
  );
};
