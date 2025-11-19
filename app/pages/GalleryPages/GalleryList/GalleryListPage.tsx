// 1. React
import React, { useEffect, useRef, useState } from 'react';

import {
  Dimensions,
  findNodeHandle,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';

import { FlashList } from '@shopify/flash-list';

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
  const { selectedTag, setCurrentGalleryIndex, currentGalleryIndex } =
    useSelectionStore();
  const { tags, ageGroups, getGallery } = useMediaStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Derived value or local variables
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
    if (!selectedTag) return;
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
  }, [scrollViewHeight, selectedTag]);

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
              ref={(ref: any) => {
                itemRefs.current[ageKey as TagKey] = ref;
              }}
              collapsable={false}
              key={ageKey}
              minHeight={
                isLastAgeGroup ? `${screenHeight}px` : `${screenHeight / 3}px`
              }
            >
              <ContentContainer gap={0}>
                <ContentContainer paddingHorizontal={20}>
                  <Head>
                    {tags?.filter(item => item.key === ageKey)[0]?.label ||
                      ageKey}{' '}
                    ({ageGroup.galleryCount || 0})
                  </Head>
                </ContentContainer>
                {ageKey === 'AI_PHOTO' ? (
                  <FlashList
                    data={ageGroup.gallery}
                    numColumns={2}
                    estimatedItemSize={200}
                    contentContainerStyle={{
                      padding: 20,
                    }}
                    renderItem={({ item }: { item: any }) => {
                      const galleryItem = item as GalleryType;
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
                            source={{ uri: galleryItem.url }}
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
                  <FlashList
                    data={ageGroup.gallery}
                    numColumns={2}
                    estimatedItemSize={200}
                    renderItem={({ item }: { item: any }) => {
                      const galleryItem = item as GalleryType;
                      return (
                        <TouchableOpacity
                          onPress={() => moveToStoryDetailPage(galleryItem)}
                          style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginBottom: 4,
                            margin: 2,
                          }}
                        >
                          <FastImage
                            source={{ uri: galleryItem.url }}
                            style={{ width: '100%', aspectRatio: 1 }}
                            cacheControl={FastImage.cacheControl.immutable}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        </TouchableOpacity>
                      );
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
          videoUri={allGallery[currentGalleryIndex]?.url || ''}
          onClose={() => setVideoModalOpen(false)}
        />
      )}
    </ScreenContainer>
  );
};

export default GalleryListPage;
