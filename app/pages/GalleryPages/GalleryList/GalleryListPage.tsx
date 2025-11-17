// 1. React
import React, { useEffect, useRef, useState } from 'react';

import {
  Dimensions,
  findNodeHandle,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import MasonryList from 'react-native-masonry-list';
import VMasonryList from '@react-native-seoul/masonry-list';

import { GalleryType, TagKey } from '../../../types/core/media.type';

import { Head } from '../../../components/ui/base/TextBase';

import { ScreenContainer } from '../../../components/ui/layout/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';

import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';

import { useMediaStore } from '../../../stores/media.store';
import { useSelectionStore } from '../../../stores/selection.store';
import { useAuthStore } from '../../../stores/auth.store';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../navigation/types.tsx';
import Video from 'react-native-video';
import VideoModal from '../../../components/ui/interaction/VideoModal';

const GalleryListPage = () => {
  // Refs
  const scrollContainerRef = useRef<any>(null);
  const itemRefs = useRef<{ [key in TagKey]?: View | null }>({});

  // React hooks
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  // 글로벌 상태 관리
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());
  const { selectedTag, setCurrentGalleryIndex } = useSelectionStore();
  const { tags, ageGroups, getGallery } = useMediaStore();
  const selectedGalleryIndex = useSelectionStore(
    state => state.selectedGalleryItems,
  );

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Derived value or local variables
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const allGallery = getGallery();
  const ageGroupsArray = ageGroups ? Object.entries(ageGroups) : [];

  // Custom functions
  const handleScrollViewLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height >= scrollViewHeight + SCREEN_HEIGHT) {
      setScrollViewHeight(height);
    }
  };

  const moveToStoryDetailPage = (gallery: GalleryType) => {
    // 전체 갤러리에서 해당 아이템의 인덱스 찾기
    const allGalleryIndex = allGallery.findIndex(
      item => item.id === gallery.id,
    );

    if (allGalleryIndex !== -1) {
      setCurrentGalleryIndex(allGalleryIndex);
    } else {
      setCurrentGalleryIndex(0);
    }

    navigation.push('NoTab', {
      screen: 'StoryViewNavigator',
      params: {
        screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
      },
    });
  };

  // Side effects
  useEffect(() => {
    const targetRef = itemRefs.current[selectedTag.key as TagKey];
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
            scrollRef.scrollTo({ y: y, animated: true });
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
        scrollEventThrottle={50}
      >
        {ageGroupsArray.map(([ageKey, ageGroup], index) => {
          const isLastAgeGroup = index === ageGroupsArray.length - 1;

          return (
            <ContentContainer
              ref={ref => (itemRefs.current[ageKey as TagKey] = ref)}
              collapsable={false}
              key={ageKey}
              minHeight={isLastAgeGroup ? screenHeight : screenHeight / 3}
            >
              <ContentContainer gap={0}>
                <ContentContainer paddingHorizontal={20}>
                  <Head>
                    {tags.filter(item => item.key === ageKey)[0]?.label ||
                      ageKey}{' '}
                    ({ageGroup.galleryCount || 0})
                  </Head>
                </ContentContainer>
                {ageKey === 'AI_PHOTO' ? (
                  <VMasonryList
                    data={ageGroup.gallery}
                    numColumns={2}
                    contentContainerStyle={{
                      padding: 20,
                    }}
                    renderItem={({
                      item,
                      i,
                    }: {
                      item: GalleryType;
                      i: number;
                    }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setVideoModalOpen(true)}
                          style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginBottom: 4,
                            flex: 1,
                          }}
                        >
                          <Video
                            source={{ uri: item.url }}
                            style={{
                              width: '100%',
                              aspectRatio: 0.75,
                              backgroundColor: 'black',
                            }}
                            paused={false}
                            resizeMode="cover"
                            muted={true}
                            controls={false}
                            onError={error => {
                              console.log('Video thumbnail error:', error);
                            }}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : (
                  <MasonryList
                    images={ageGroup.gallery.map((e: GalleryType) => ({
                      uri: e.url,
                      id: e.id,
                    }))}
                    numColumns={2}
                    spacing={4}
                    containerWidth={screenWidth}
                    imageContainerStyle={{ borderRadius: 12 }}
                    customImageComponent={FastImage}
                    customImageProps={{
                      cacheControl: FastImage.cacheControl.immutable,
                      resizeMode: FastImage.resizeMode.cover,
                    }}
                    onPressImage={(gallery: GalleryType) => {
                      moveToStoryDetailPage(gallery);
                    }}
                  />
                )}
              </ContentContainer>
            </ContentContainer>
          );
        })}
      </ScrollContentContainer>
      {videoModalOpen && (
        <VideoModal
          opened={videoModalOpen}
          videoUri={allGallery[selectedGalleryIndex].url}
          onClose={() => setVideoModalOpen(false)}
        />
      )}
    </ScreenContainer>
  );
};

export default GalleryListPage;
