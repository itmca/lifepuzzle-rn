import React from 'react';
import {Keyboard, Pressable} from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import MediumText from '../styled/components/Text';
import {RecordedVoice} from './StoryKeyboardVoiceRecord';
import {useRecoilState} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import Config from 'react-native-config';
import {SmallImage} from '../styled/components/Image.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';

type MenuProps = {
  type: 'bar' | 'list';
};
type Props = {
  showText?: boolean;
  onClick?: void;
};
export const StoryWritingMenuBtn = ({type}: MenuProps): JSX.Element => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const voiceToText = writingStory.voice ? true : false;
  const playVoice = writingStory.voice ? true : false;
  const recordVoice = !playVoice;
  const textToImage = Config.TEXT_TO_IMAGE == 'TRUE';
  const openAlbum = true;
  const iconCnt =
    (voiceToText ? 1 : 0) +
    (playVoice ? 1 : 0) +
    (textToImage ? 1 : 0) +
    (openAlbum ? 1 : 0);
  return type === 'list' || iconCnt === 1 ? (
    <>{playVoice ? <PlayVoice showText /> : <RecordVoice showText />}</>
  ) : (
    <ContentContainer
      withScreenPadding
      useHorizontalLayout
      justifyContent="space-around">
      {playVoice ? <PlayVoice /> : <></>}
      {recordVoice ? <RecordVoice /> : <></>}
    </ContentContainer>
  );
};

const PlayVoice = ({showText = false, onClick}: Props): JSX.Element => {
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
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
            <FontAwesome6 size={30} color={Color.PRIMARY_LIGHT} name={'play'} />
          </ContentContainer>
          <ContentContainer flex={1}>
            <MediumText>음성 재생</MediumText>
          </ContentContainer>
          <RecordedVoice recordTime={playInfo.duration ?? '00:00:00'} />
        </ContentContainer>
      ) : (
        <FontAwesome6 size={30} color={Color.PRIMARY_LIGHT} name={'play'} />
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
              source={require('../../assets/images/voide-recod-icon.png')}
            />
          </ContentContainer>
          <ContentContainer flex={1}>
            <MediumText>음성 녹음</MediumText>
          </ContentContainer>
        </ContentContainer>
      ) : (
        <FontAwesome6 size={30} color={Color.PRIMARY_LIGHT} name={'play'} />
      )}
    </Pressable>
  );
};
