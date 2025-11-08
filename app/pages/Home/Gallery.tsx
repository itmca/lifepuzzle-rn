import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useRecoilState} from 'recoil';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {ScrollView, useWindowDimensions} from 'react-native';
import {selectedTagState} from '../../recoils/photos.recoil.ts';
import {
  AgeGroupsType,
  GalleryType,
  PhotoHeroType,
  TagKey,
  TagType,
} from '../../types/photo.type.ts';
import {Color} from '../../constants/color.constant.ts';

import {NotificationBar} from '../../components/styled/components/NotificationBar.tsx';
import {BasicCard} from '../../components/card/Card.tsx';
import GalleryTag from './GalleryTag.tsx';

type props = {
  hero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];
};

const Gallery = ({ageGroups, tags}: props): JSX.Element => {
  // Refs
  const carouselRef = useRef<ICarouselInstance>(null);
  const scrollRef = useRef<ScrollView>(null);

  // React hooks
  const [isScrolling, setIsScrolling] = useState(false);

  // 글로벌 상태 관리 (Recoil)
  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Memoized 값
  const {width: windowWidth} = useWindowDimensions();

  // Custom functions (핸들러, 로직 함수 등)
  const moveToStoryListPage = (index: GalleryType['index']) => {
    if (!isScrolling) {
      navigation.push('NoTab', {
        screen: 'StoryViewNavigator',
        params: {
          screen: 'StoryList',
        },
      });
    }
  };

  // Side effects (useEffect 등)
  useEffect(() => {
    if (!selectedTag?.key || !tags?.length) return;

    const index = tags.findIndex(item => item.key === selectedTag.key);
    if (index === -1) return;

    if (index < tags.length / 3) {
      scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
    } else if ((tags.length / 3) * 2 < index) {
      scrollRef.current?.scrollToEnd();
    }
  }, [selectedTag?.key, tags?.length]);

  return (
    <ContentContainer flex={1}>
      <ContentContainer paddingHorizontal={20}>
        <NotificationBar text="나이대별 주인공의 사진/동영상을 추가해보세요" />
      </ContentContainer>
      <ContentContainer paddingLeft={20}>
        <ScrollContentContainer
          useHorizontalLayout
          gap={6}
          ref={scrollRef}
          paddingRight={20}>
          {tags.map((item: TagType, index) => {
            return (
              <GalleryTag
                key={item.key || index}
                carouselRef={carouselRef}
                item={item}
                index={index}
              />
            );
          })}
        </ScrollContentContainer>
      </ContentContainer>
      <ContentContainer
        flex={1}
        gap={0}
        alignItems={'center'}
        justifyContent={'flex-start'}>
        <Carousel
          ref={carouselRef}
          data={tags}
          mode={'parallax'}
          defaultIndex={
            tags.findIndex(item => item.key === selectedTag.key) < 0
              ? 0
              : tags.findIndex(item => item.key === selectedTag.key)
          }
          modeConfig={{
            parallaxScrollingScale: 0.88,
            parallaxScrollingOffset: 70,
            parallaxAdjacentItemScale: 0.72,
          }}
          loop={tags.length <= 2 ? false : true}
          width={windowWidth}
          height={'100%'}
          onSnapToItem={index => {
            setSelectedTag({...tags[index]});
          }}
          onProgressChange={(_: number, absoluteProgress: number) => {
            setIsScrolling(absoluteProgress % 1 !== 0);
          }}
          renderItem={({item: tag}: any) => {
            return (
              <ContentContainer
                key={tag.key}
                style={{
                  transform: [{translateY: -20}],
                }}>
                <BasicCard
                  photoUrls={
                    ageGroups[tag.key as TagKey]?.gallery.map(g => g.url) ?? []
                  }
                  fallbackBackgroundColor={Color.WHITE}
                  fallbackBorderColor={Color.GREY_100}
                  fallbackIconName={'pictureNone'}
                  fallbackText={'사진이 없습니다'}
                  height={'100%'}
                  width={windowWidth}
                  onPress={() => {
                    const index =
                      ageGroups[tag.key as TagKey]?.gallery[0].index;
                    if (index) {
                      moveToStoryListPage(index);
                    }
                  }}
                />
              </ContentContainer>
            );
          }}
        />
      </ContentContainer>
    </ContentContainer>
  );
};

export default Gallery;
