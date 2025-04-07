import React from 'react';
import {Photo} from '../styled/components/Image';
import {LegacyColor} from '../../constants/color.constant';
import {ContentContainer} from '../styled/container/ContentContainer';
import {IconButton} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import {HeroAvatar} from '../avatar/HeroAvatar';
import {useRecoilState} from 'recoil';
import {writingHeroState} from '../../recoils/hero-write.recoil';
import {useCommonActionSheet} from '../styled/components/ActionSheet';
import {HeroSettingNavigationProps} from '../../navigation/types';
import {useNavigation} from '@react-navigation/native';
type props = {
  width?: string;
  photoUri?: string;
  title?: string;
  onChangeTitle?: (text: string) => void;
  puzzleCnt?: number;
  onCameraClick: () => void;
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
  const navigation =
    useNavigation<HeroSettingNavigationProps<'HeroModification'>>();

  const {showActionSheet} = useCommonActionSheet({
    options: [
      {
        label: '앨범에서 선택',
        value: 'gallery',
        onSelect: () => {
          onCameraClick();
        },
      },
      {
        label: '주인공 사진 삭제',
        value: 'delete',
        onSelect: () => {
          setWritingHero({
            ...writingHero,
            imageURL: undefined,
            isProfileImageUpdate: true,
          });
        },
      },
    ],
  });
  return (
    <TouchableOpacity onPress={photoUri ? showActionSheet : onCameraClick}>
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
      </ContentContainer>
    </TouchableOpacity>
  );
};
