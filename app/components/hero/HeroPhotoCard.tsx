import React from 'react';
import {Photo} from '../styled/components/Image';
import {Color} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import {IconButton} from 'react-native-paper';
import {GestureResponderEvent} from 'react-native';
import {HeroAvatar} from '../avatar/HeroAvatar';

type props = {
  width?: string;
  photoUri?: string;
  title?: string;
  onChangeTitle?: (text: string) => void;
  puzzleCnt?: number;
  onCameraClick?: (e: GestureResponderEvent) => void;
};

export const HeroPhotoCard = ({
  width = '320px',
  photoUri = undefined,
  title = '',
  onChangeTitle,
  puzzleCnt = 0,
  onCameraClick,
}: props): JSX.Element => {
  return (
    <ContentContainer
      width={width}
      height={'395px'}
      borderRadius={32}
      backgroundColor={Color.GRAY}>
      <ContentContainer
        backgroundColor={Color.SECONDARY_LIGHT}
        alignCenter
        height="395px"
        width="320px"
        borderRadius={32}>
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
          absoluteBottomPosition
          withContentPadding
          useHorizontalLayout
          withNoBackground>
          <ContentContainer alignItems={'flex-end'} withNoBackground>
            <IconButton
              icon="camera"
              size={24}
              containerColor={Color.WHITE}
              onPress={onCameraClick}
            />
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
    </ContentContainer>
  );
};
