// 1. React
import React, {useEffect, useRef, useState} from 'react';

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
import {useRecoilState, useRecoilValue} from 'recoil';
import {GalleryType, TagKey} from '../../types/photo.type';

import {Head} from '../../../components/ui/base/TextBase';

import {ScreenContainer} from '../../../components/ui/layout/ScreenContainer';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../components/ui/layout/ContentContainer.tsx';

import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';

import {
  ageGroupsState,
  getGallery,
  selectedGalleryIndexState,
  selectedTagState,
  tagState,
} from '../../../recoils/photos.recoil.ts';
import {isLoggedInState} from '../../../recoils/auth.recoil.ts';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../navigation/types.tsx';
import Video from 'react-native-video';
import VideoModal from '../../../components/ui/interaction/VideoModal';

const GalleryListPage = () => {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const scrollContainerRef = useRef<any>(null);
  const itemRefs = useRef<{[key in TagKey]?: View | null}>({});

  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const navigation = useNavigation<BasicNavigationProps>();

  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [selectedGalleryIndex, setSelectedGalleryIndex] =
    useRecoilState<number>(selectedGalleryIndexState);
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);

  const [tags] = useRecoilState(tagState);
  const [ageGroups] = useRecoilState(ageGroupsState);
  const allGallery = useRecoilValue(getGallery);
  const [selectedTag] = useRecoilState(selectedTagState);

  const ageGroupsArray = Object.entries(ageGroups);

  const handleScrollViewLayout = (event: any) => {
    const {height} = event.nativeEvent.layout;
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
      setSelectedGalleryIndex(allGalleryIndex);
    } else {
      setSelectedGalleryIndex(0);
    }

    navigation.push('NoTab', {
      screen: 'StoryViewNavigator',
      params: {
        screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
      },
    });
  };
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
              ref={ref => (itemRefs.current[ageKey as TagKey] = ref)}
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
                {ageKey === 'AI_PHOTO' ? (
                  <VMasonryList
                    data={ageGroup.gallery}
                    numColumns={2}
                    contentContainerStyle={{
                      padding: 20,
                    }}
                    renderItem={({item, i}: {item: GalleryType; i: number}) => {
                      return (
                        <TouchableOpacity
                          onPress={() => setVideoModalOpen(true)}
                          style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            marginBottom: 4,
                            flex: 1,
                          }}>
                          <Video
                            source={{uri: item.url}}
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
