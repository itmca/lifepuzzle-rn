import React, {useEffect, useRef} from 'react';
import {findNodeHandle, FlatList, UIManager, View} from 'react-native';
import MasonryList from 'react-native-masonry-list';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  ageGroupsState,
  selectedGalleryIndexState,
  selectedTagState,
  tagState,
} from '../../recoils/photos.recoil';
import {AgeType, GalleryType} from '../../types/photo.type';
import {Head} from '../../components/styled/components/Text';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';
import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {isLoggedInState} from '../../recoils/auth.recoil.ts';

const StoryListPage = () => {
  const navigation = useNavigation<BasicNavigationProps>();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [selectedGalleryIndex, setSelectedGalleryIndex] =
    useRecoilState<number>(selectedGalleryIndexState);

  const [tags] = useRecoilState(tagState);
  const [ageGroups] = useRecoilState(ageGroupsState);
  const [selectedTag] = useRecoilState(selectedTagState);

  const flatListRef = useRef<FlatList>(null);
  const itemRefs = useRef<{[key in AgeType]?: View | null}>({});

  // 스크롤 이동 (선택된 태그로)
  useEffect(() => {
    const targetRef = itemRefs.current[selectedTag.key as AgeType];
    const listRef = flatListRef.current;

    if (targetRef && listRef) {
      const nodeHandle = findNodeHandle(targetRef);
      if (nodeHandle) {
        UIManager.measureLayout(
          nodeHandle,
          findNodeHandle(listRef),
          () => console.warn(),
          (_x, y) => {
            flatListRef.current?.scrollToOffset({offset: y, animated: true});
          },
        );
      }
    }
  }, [selectedTag]);
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
      <ScrollContentContainer paddingVertical={16}>
        {Object.entries(ageGroups).map(([ageKey, ageGroup]) => {
          return (
            <ContentContainer gap={0}>
              <ContentContainer paddingHorizontal={20}>
                <Head>
                  {tags.filter(item => item.key === ageKey)[0].label}(
                  {ageGroups[ageKey as AgeType]?.galleryCount})
                </Head>
              </ContentContainer>
              <MasonryList
                images={ageGroup.gallery.map((e: GalleryType) => ({
                  uri: e.url,
                  id: e.id,
                }))}
                spacing={4}
                imageContainerStyle={{borderRadius: 12}}
                onPressImage={(gallery: GalleryType) => {
                  moveToStoryDetailPage(gallery);
                }}
              />
            </ContentContainer>
          );
        })}
      </ScrollContentContainer>
    </ScreenContainer>
  );
};

export default StoryListPage;
