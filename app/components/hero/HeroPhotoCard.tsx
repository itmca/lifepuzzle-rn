import React from 'react';
import {Photo} from '../styled/components/Image';
import {LegacyColor} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import {IconButton} from 'react-native-paper';
import {LockableTextInput} from '../input/LockableTextInput';
import {GestureResponderEvent, Pressable} from 'react-native';
import Tag from '../styled/components/Tag';
import LinearGradient from 'react-native-linear-gradient';
import {HeroAvatar} from '../avatar/HeroAvatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useRecoilState} from 'recoil';
import {selectedHeroPhotoState} from '../../recoils/hero.recoil';
import {writingHeroState} from '../../recoils/hero-write.recoil';
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
  const [writingHero, setWritingHero] = useRecoilState(writingHeroState);
  return (
    <ContentContainer width={width} height={'395px'}>
      <ContentContainer
        borderRadius={32}
        backgroundColor={LegacyColor.SECONDARY_LIGHT}
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
              containerColor={LegacyColor.WHITE}
              onPress={onCameraClick}
            />
          </ContentContainer>
        </ContentContainer>
      </ContentContainer>
      {photoUri && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: LegacyColor.WHITE,
            borderColor: LegacyColor.GRAY,
            borderWidth: 0.5,
            width: 24,
            height: 24,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            setWritingHero({imageURL: undefined, isProfileImageUpdate: true});
          }}>
          <Icon size={18} color={LegacyColor.BLACK} name={'close'} />
        </Pressable>
      )}
    </ContentContainer>
  );
};
