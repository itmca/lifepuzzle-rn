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
import {GestureResponderEvent, ImageSourcePropType} from 'react-native';
import Tag from '../styled/components/Tag';
import {ImageButton} from '../styled/components/Button';
import LinearGradient from 'react-native-linear-gradient';

type props = {
  width?: string;
  photoUri?: ImageSourcePropType | undefined;
  title?: string;
  onChangeTitle?: (text: string) => void;
  puzzleCnt?: number;
  onClick?: (e: GestureResponderEvent) => void;
};

export const HeroPhotoCard = ({
  width = '320px',
  photoUri = undefined,
  title = '',
  onChangeTitle,
  puzzleCnt = 0,
  onClick,
}: props): JSX.Element => {
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();
  return (
    <ContentContainer
      width={width}
      height={'395px'}
      borderRadius={12}
      backgroundColor={Color.GRAY}>
      <ImageButton
        backgroundColor={'transparent'}
        marginBottom={'0px'}
        onPress={onClick}>
        <Photo
          source={photoUri ?? require('../../assets/images/profile_icon.png')}
          borderRadius={12}
          resizeMode={'contain'}
        />
        <LinearGradient
          colors={['#FFFFFF22', '#81818122', '#00000022']}
          style={{
            flex: 1,
            width: '100%',
            height: '75px',
            position: 'absolute',
            bottom: 0,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}>
          <HorizontalContentContainer padding={14}>
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
                  iconSource={require('../../assets/images/puzzle-onepiece.png')}
                  iconStyle={{transform: [{rotate: '29.84deg'}]}}
                  text={` ${puzzleCnt}개`}></Tag>
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
        </LinearGradient>
      </ImageButton>
    </ContentContainer>
  );
};
