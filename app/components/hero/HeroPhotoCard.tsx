import React from 'react';
import {Photo} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import {useNavigation} from '@react-navigation/native';
import {HeroSettingNavigationProps} from '../../navigation/types';
import {
  ContentContainer,
  HorizontalContentContainer,
} from '../styled/container/ContentContainer';
import {IconButton} from 'react-native-paper';
import {LockableTextInput} from '../input/LockableTextInput';
import {GestureResponderEvent} from 'react-native';
import Tag from '../styled/components/Tag';

type props = {
  photoUri?: string | undefined;
  title?: string;
  onChangeTitle?: (text: string) => void;
  puzzleCnt?: number;
  onClick?: (e: GestureResponderEvent) => void;
};

export const HeroPhotoCard = ({
  photoUri = '',
  title = '',
  onChangeTitle,
  puzzleCnt = 0,
  onClick,
}: props): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  return (
    <ContentContainer
      height={'395px'}
      borderRadius={12}
      backgroundColor={Color.DARK_GRAY}>
      <Photo source={{uri: photoUri}} borderRadius={12} />
      <ContentContainer
        height={'75px'}
        backgroundColor={'#FFFFFF33'}
        position={'absolute'}
        justifyContent={'center'}
        padding={20}>
        <HorizontalContentContainer>
          <ContentContainer flex={1} gap={'5px'}>
            <LockableTextInput
              customStyle={{
                minWidth: 130,
                height: 30,
                paddingHorizontal: 5,
              }}
              text={title}
              onChangeText={onChangeTitle}
              placeholder="행복했던 나날들"
            />
            <ContentContainer alignItems={'flex-start'}>
              <Tag
                backgroundColor={Color.WHITE}
                width={'auto'}
                height={'18px'}
                fontSize={10}
                fontWeight={'600'}
                borderRadius={20}
                textColor={Color.FONT_DARK}
                text={`맞춰진 퍼즐 ${puzzleCnt}개`}></Tag>
            </ContentContainer>
          </ContentContainer>
          <ContentContainer width={'40px'} alignItems={'center'}>
            <IconButton
              icon="camera"
              size={24}
              containerColor={Color.WHITE}
              onPress={onClick}
            />
          </ContentContainer>
        </HorizontalContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};
