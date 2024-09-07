import React from 'react';
import {Photo} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import {IconButton} from 'react-native-paper';
import {LockableTextInput} from '../input/LockableTextInput';
import {GestureResponderEvent} from 'react-native';
import Tag from '../styled/components/Tag';
import {ImageButton} from '../styled/components/Button';
import LinearGradient from 'react-native-linear-gradient';
import {HeroAvatar} from '../avatar/HeroAvatar';

type props = {
  width?: string;
  photoUri?: string;
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
  return (
    <ContentContainer
      width={width}
      height={'395px'}
      borderRadius={32}
      backgroundColor={Color.GRAY}>
      <ImageButton
        backgroundColor={Color.SECONDARY_LIGHT}
        height="395px"
        width="320px"
        borderRadius={32}
        onPress={onClick}>
        {photoUri ? (
          <Photo
            source={
              photoUri
                ? {uri: photoUri}
                : require('../../assets/images/profile_icon.png')
            }
            borderRadius={32}
          />
        ) : (
          <HeroAvatar
            color="#32C5FF"
            style={{backgroundColor: 'transparent'}}
            size={156}
            imageURL={photoUri}
          />
        )}
        <ContentContainer
          height={'200px'}
          absoluteBottomPosition
          withNoBackground>
          <LinearGradient
            colors={['#00000066', '#00000077', '#00000099']}
            style={{
              flex: 1,
              width: '100%',
              height: '75px',
              position: 'absolute',
              bottom: 0,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
            }}>
            <ContentContainer
              withContentPadding
              useHorizontalLayout
              withNoBackground>
              <ContentContainer withNoBackground width={'200px'}>
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
                <ContentContainer alignCenter withNoBackground>
                  <Tag
                    backgroundColor={Color.WHITE}
                    height={'18px'}
                    iconSource={require('../../assets/images/puzzle-onepiece.png')}
                    iconStyle={{transform: [{rotate: '29.84deg'}]}}
                    text={` ${puzzleCnt}개`}
                  />
                </ContentContainer>
              </ContentContainer>
              <ContentContainer
                width={'40px'}
                alignItems={'center'}
                withNoBackground>
                <IconButton
                  icon="camera"
                  size={24}
                  containerColor={Color.WHITE}
                  onPress={onClick}
                />
              </ContentContainer>
            </ContentContainer>
          </LinearGradient>
        </ContentContainer>
      </ImageButton>
    </ContentContainer>
  );
};
