// 1. React
import React, {useEffect, useRef, useState} from 'react';

import {Dimensions, findNodeHandle, UIManager, View} from 'react-native';
import FastImage from 'react-native-fast-image';

import MasonryList from 'react-native-masonry-list';
import {useRecoilState, useRecoilValue} from 'recoil';
import {AgeType, GalleryType} from '../../types/photo.type';

import {Head} from '../../components/styled/components/Text';

import {ScreenContainer} from '../../components/styled/container/ScreenContainer.tsx';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer';

import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';

import {
  ageGroupsState,
  selectedGalleryIndexState,
  selectedTagState,
  tagState,
} from '../../recoils/photos.recoil';
import {isLoggedInState} from '../../recoils/auth.recoil.ts';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types.tsx';

const StoryListPage = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const scrollContainerRef = useRef<any>(null);
  const itemRefs = useRef<{[key in AgeType]?: View | null}>({});

  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  const navigation = useNavigation<BasicNavigationProps>();

  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [, setSelectedGalleryIndex] = useRecoilState<number>(
    selectedGalleryIndexState,
  );
  const [tags] = useRecoilState(tagState);
  const [ageGroups] = useRecoilState(ageGroupsState);
  const [selectedTag] = useRecoilState(selectedTagState);

  const ageGroupsArray = Object.entries(ageGroups);

  const handleScrollViewLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
    if (height >= scrollViewHeight + SCREEN_HEIGHT) {
      setScrollViewHeight(height);
    }
  };

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
  useEffect(() => {
    const targetRef = itemRefs.current[selectedTag.key as AgeType];
    const scrollRef = scrollContainerRef.current?.getScrollResponder();

    if (targetRef && scrollRef) {
      const nodeHandle = findNodeHandle(targetRef);
      const scrollNodeHandle = findNodeHandle(scrollRef);

      if (nodeHandle && scrollNodeHandle) {
        UIManager.measureLayout(
          nodeHandle,
          scrollNodeHandle,
          () => console.warn('Failed to measure layout for scroll!'),
          (_x, y) => {
            scrollRef.scrollTo({y: y, animated: true});
          },
        );
      }
    }
  }, [scrollViewHeight]);

  return (
    <ScreenContainer>
      <ScrollContentContainer
        ref={scrollContainerRef}
        paddingVertical={16}
        onLayout={handleScrollViewLayout}
        scrollEventThrottle={50}>
        {ageGroupsArray.map(([ageKey, ageGroup], index) => {
          const isLastAgeGroup = index === ageGroupsArray.length - 1;

          return (
            <ContentContainer
              ref={ref => (itemRefs.current[ageKey as AgeType] = ref)}
              collapsable={false}
              key={ageKey}
              minHeight={isLastAgeGroup ? screenHeight : screenHeight / 3}>
              <ContentContainer gap={0}>
                <ContentContainer paddingHorizontal={20}>
                  <Head>
                    {tags.filter(item => item.key === ageKey)[0]?.label ||
                      ageKey}{' '}
                    ({ageGroup.galleryCount || 0})
                  </Head>
                </ContentContainer>
                <MasonryList
                  images={ageGroup.gallery.map((e: GalleryType) => ({
                    uri: e.url,
                    id: e.id,
                  }))}
                  numColumns={2}
                  spacing={4}
                  containerWidth={screenWidth}
                  imageContainerStyle={{borderRadius: 12}}
                  customImageComponent={FastImage}
                  customImageProps={{
                    cacheControl: FastImage.cacheControl.immutable,
                    resizeMode: FastImage.resizeMode.cover,
                  }}
                  onPressImage={(gallery: GalleryType) => {
                    moveToStoryDetailPage(gallery);
                  }}
                />
              </ContentContainer>
            </ContentContainer>
          );
        })}
      </ScrollContentContainer>
    </ScreenContainer>
  );
};

export default StoryListPage;
