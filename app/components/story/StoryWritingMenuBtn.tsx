import React from 'react';
import {Pressable} from 'react-native';

import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {Color} from '../../constants/color.constant';
import {MediumImage} from '../styled/components/Image';
import {ContentContainer} from '../styled/container/ContentContainer';
import MediumText from '../styled/components/Text';
import {RecordedVoice} from './StoryKeyboardVoiceRecord';
import {useRecoilState} from 'recoil';
import {
  writingStoryState,
  playInfoState,
} from '../../recoils/story-write.recoil';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';

type Props = {
  showText?: boolean;
  onClick?: void;
};
export const VoiceToText = ({showText = false}: Props): JSX.Element => {
  return (
    <Pressable onPress={() => {}}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="flex-start"
          paddingHorizontal={20}
          paddingVertical={12}>
          <MediumImage
            width={32}
            height={32}
            resizeMode={'contain'}
            source={require('../../assets/images/record-text.png')}
          />
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

export const PlayVoice = ({showText = false, onClick}: Props): JSX.Element => {
  const [writingStory, setWritingStory] = useRecoilState(writingStoryState);
  const [playInfo, setPlayInfo] = useRecoilState(playInfoState);
  const visible = writingStory.voice;
  return visible ? (
    // {writingStory.voice ?(
    <Pressable
      onPress={() => {
        setPlayInfo({isOpen: true});
      }}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="space-between"
          paddingHorizontal={20}
          paddingVertical={12}>
          <FontAwesome6 size={32} color={Color.PRIMARY_LIGHT} name={'play'} />
          <ContentContainer flex={1}>
            <MediumText>음성 재생</MediumText>
          </ContentContainer>
          <RecordedVoice recordTime={playInfo.duration ?? '00:00'} />
        </ContentContainer>
      ) : (
        <FontAwesome6 size={32} color={Color.PRIMARY_LIGHT} name={'play'} />
      )}
    </Pressable>
  ) : (
    <></>
  );
  //):<></>}
};

export const TextToImage = ({showText = false}: Props): JSX.Element => {
  return (
    <Pressable onPress={() => {}}>
      {showText ? (
        <ContentContainer
          useHorizontalLayout
          justifyContent="flex-start"
          paddingHorizontal={20}
          paddingVertical={12}>
          <MediumImage
            width={32}
            height={32}
            resizeMode={'contain'}
            source={require('../../assets/images/text-image.png')}
          />
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

export const OpenAlbum = ({showText = false}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <Pressable
      onPress={() => {
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
          <FontAwesome6 size={32} color={Color.YELLOW} name={'camera'} />
          <MediumText>사진/동영상</MediumText>
        </ContentContainer>
      ) : (
        <FontAwesome6 size={32} color={Color.YELLOW} name={'camera'} />
      )}
    </Pressable>
  );
};
