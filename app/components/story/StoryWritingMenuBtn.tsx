import React from 'react';
import {Keyboard, Pressable} from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {Color} from '../../constants/color.constant';
import {MediumImage} from '../styled/components/Image';
import {ContentContainer} from '../styled/container/ContentContainer';
import MediumText from '../styled/components/Text';
import {RecordedVoice} from './StoryKeyboardVoiceRecord';
import {useRecoilState} from 'recoil';
import {
  playInfoState,
  writingStoryState,
} from '../../recoils/story-write.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import Config from 'react-native-config';
import {useVoiceToText} from '../../service/hooks/story.write.hook';

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
  const textToImage = Config.TEXT_TO_IMAGE == 'TRUE';
  const openAlbum = true;
  const iconCnt =
    (voiceToText ? 1 : 0) +
    (playVoice ? 1 : 0) +
    (textToImage ? 1 : 0) +
    (openAlbum ? 1 : 0);
  return type == 'list' || iconCnt == 1 ? (
    <>
      {voiceToText ? <VoiceToText showText /> : <></>}
      {playVoice ? <PlayVoice showText /> : <></>}
      {textToImage ? <TextToImage showText /> : <></>}
      {openAlbum ? <OpenAlbum showText /> : <></>}
    </>
  ) : (
    <ContentContainer
      withScreenPadding
      useHorizontalLayout
      justifyContent="space-around">
      {voiceToText ? <VoiceToText /> : <></>}
      {playVoice ? <PlayVoice /> : <></>}
      {textToImage ? <TextToImage /> : <></>}
      {openAlbum ? <OpenAlbum /> : <></>}
    </ContentContainer>
  );
};

const VoiceToText = ({showText = false}: Props): JSX.Element => {
  const [voiceText] = useVoiceToText();
  return (
    <Pressable
      onPress={() => {
        voiceText();
      }}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="flex-start"
          paddingHorizontal={20}
          paddingVertical={12}>
          <ContentContainer width={'32px'} alignCenter>
            <MediumImage
              width={32}
              height={32}
              resizeMode={'contain'}
              source={require('../../assets/images/record-text.png')}
            />
          </ContentContainer>
          <MediumText>음성-{'>'}텍스트 변환</MediumText>
        </ContentContainer>
      ) : (
        <MediumImage
          width={32}
          height={32}
          resizeMode={'contain'}
          source={require('../../assets/images/record-text.png')}
        />
      )}
    </Pressable>
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

const TextToImage = ({showText = false}: Props): JSX.Element => {
  return (
    <Pressable onPress={() => {}}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="flex-start"
          paddingHorizontal={20}
          paddingVertical={12}>
          <ContentContainer width={'32px'} alignCenter>
            <MediumImage
              width={32}
              height={32}
              resizeMode={'contain'}
              source={require('../../assets/images/text-image.png')}
            />
          </ContentContainer>
          <MediumText>텍스트 기반 이미지 생성</MediumText>
        </ContentContainer>
      ) : (
        <MediumImage
          width={32}
          height={32}
          resizeMode={'contain'}
          source={require('../../assets/images/text-image.png')}
        />
      )}
    </Pressable>
  );
};

const OpenAlbum = ({showText = false}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <Pressable
      onPressOut={() => {
        navigation.push('NoTab', {
          screen: 'StoryWritingNavigator',
          params: {
            screen: 'StorySelectingPhoto',
          },
        });
      }}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="flex-start'"
          paddingHorizontal={20}
          paddingVertical={12}>
          <ContentContainer width={'32px'} alignCenter>
            <FontAwesome6 size={32} color={Color.YELLOW} name={'camera'} />
          </ContentContainer>
          <MediumText>사진/동영상</MediumText>
        </ContentContainer>
      ) : (
        <FontAwesome6 size={32} color={Color.YELLOW} name={'camera'} />
      )}
    </Pressable>
  );
};
