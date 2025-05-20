import React from 'react';
import {useRecoilState, useRecoilValue} from 'recoil';
import {LoadingContainer} from '../../components/loadding/LoadingContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer';
import MasonryList from 'react-native-masonry-list';
import LinearGradient from 'react-native-linear-gradient';

import {useNavigation} from '@react-navigation/native';
import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';

import {Color} from '../../constants/color.constant.ts';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {
  ageGroupsState,
  selectedGalleryIndexState,
  selectedTagState,
} from '../../recoils/photos.recoil.ts';
import {Head} from '../../components/styled/components/Text.tsx';
import {
  AgeGroupsType,
  AgeType,
  GalleryType,
  TagType,
} from '../../types/photo.type.ts';
import {isLoggedInState} from '../../recoils/auth.recoil.ts';

const StoryListPage = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const [ageGroups] = useRecoilState<AgeGroupsType>(ageGroupsState);
  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);
  const [selectedGalleryIndex, setSelectedGalleryIndex] =
    useRecoilState<number>(selectedGalleryIndexState);
  const moveToStoryDetailPage = (gallery: GalleryType) => {
    const index =
      ageGroups[selectedTag.key as AgeType]?.gallery.find(
        elem => elem.id === gallery.id,
      )?.index ?? 1;
    setSelectedGalleryIndex(index - 1);
    navigation.push('NoTab', {
      screen: 'StoryViewNavigator',
      params: {
        screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
      },
    });
  };
  return (
    <ScreenContainer>
      <ContentContainer flex={1} gap={0}>
        <ContentContainer paddingTop={16} paddingHorizontal={20}>
          <Head>
            {selectedTag.label}(
            {ageGroups[selectedTag.key as AgeType]?.galleryCount})
          </Head>
        </ContentContainer>
        <MasonryList
          images={ageGroups[selectedTag.key as AgeType]?.gallery.map(
            (e: GalleryType) => {
              return {
                id: e.id,
                url: e.url,
              };
            },
          )}
          columns={2}
          spacing={4}
          imageContainerStyle={{borderRadius: 12}}
          onPressImage={(gallery: GalleryType) => {
            moveToStoryDetailPage(gallery);
          }}
        />
      </ContentContainer>
      <LinearGradient
        colors={[Color.TRANSPARENT, Color.WHITE]} // 원하는 색으로 조절 가능
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
        }}
        pointerEvents="none"
      />
    </ScreenContainer>
  );
};
export default StoryListPage;
