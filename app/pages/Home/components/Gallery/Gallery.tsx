import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

import { BasicNavigationProps } from '../../../../navigation/types.tsx';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../../components/ui/layout/ContentContainer.tsx';
import { ScrollView, useWindowDimensions } from 'react-native';
import { useMediaStore } from '../../../../stores/media.store';
import { useSelectionStore } from '../../../../stores/selection.store';
import {
  AgeGroupsType,
  GalleryType,
  TagKey,
  TagType,
} from '../../../../types/core/media.type';
import { PhotoHeroType } from '../../../../types/core/hero.type';
import { Color } from '../../../../constants/color.constant.ts';

import { NotificationBar } from '../../../../components/ui/feedback/NotificationBar';
import { BasicCard } from '../../../../components/ui/display/Card';
import { BodyTextM, Title } from '../../../../components/ui/base/TextBase';
import GalleryTag from './GalleryTag.tsx';
import { BasicButton } from '../../../../components/ui/form/Button';

type props = {
  hero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];
  isError?: boolean;
  hasInitialData?: boolean;
  onRetry?: () => void;
};

const Gallery = ({
  ageGroups,
  tags,
  isError = false,
  hasInitialData = false,
  onRetry,
}: props): React.ReactElement => {
  // Refs
  const carouselRef = useRef<ICarouselInstance>(null);
  const scrollRef = useRef<ScrollView>(null);

  // React hooks
  const [isScrolling, setIsScrolling] = useState(false);

  // 글로벌 상태 관리 (Zustand)
  const { selectedTag, setSelectedTag } = useSelectionStore();
  const setGalleryError = useMediaStore(state => state.setGalleryError);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Memoized 값
  const { width: windowWidth } = useWindowDimensions();

  // Custom functions (핸들러, 로직 함수 등)
  const moveToStoryListPage = (index: GalleryType['index']) => {
    if (!isScrolling) {
      navigation.push('App', {
        screen: 'StoryViewNavigator',
        params: {
          screen: 'StoryList',
        },
      });
    }
  };

  // Side effects (useEffect 등)
  useEffect(() => {
    if (!selectedTag?.key || !tags?.length) {
      return;
    }

    const index = tags.findIndex(item => item.key === selectedTag.key);
    if (index === -1) {
      return;
    }

    if (index < tags.length / 3) {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    } else if ((tags.length / 3) * 2 < index) {
      scrollRef.current?.scrollToEnd();
    }
  }, [selectedTag?.key, tags?.length]);

  // 처음 데이터 로딩 시에만 에러 화면 표시
  const shouldShowError = isError && !hasInitialData;

  useEffect(() => {
    setGalleryError(shouldShowError);
  }, [shouldShowError, setGalleryError]);

  if (shouldShowError) {
    return (
      <ContentContainer
        flex={1}
        justifyContent="center"
        alignItems="center"
        gap={20}
        paddingBottom={40}
      >
        <ContentContainer gap={8} alignCenter>
          <Title color={Color.GREY_400}>인터넷 연결이 잠시 불안정해요</Title>
          <ContentContainer gap={0} alignCenter>
            <BodyTextM color={Color.GREY_300}>
              네트워크를 확인한 뒤 다시 시도해주세요
            </BodyTextM>
          </ContentContainer>
        </ContentContainer>
        <ContentContainer width={120}>
          <BasicButton
            text={'다시 시도'}
            height={48}
            onPress={() => onRetry?.()}
          />
        </ContentContainer>
      </ContentContainer>
    );
  }

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
          paddingRight={20}
        >
          {tags?.map((item: TagType, index) => {
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
        justifyContent={'flex-start'}
      >
        <Carousel
          ref={carouselRef}
          data={tags || []}
          mode={'parallax'}
          defaultIndex={
            !tags ||
            !selectedTag ||
            tags.findIndex(item => item.key === selectedTag.key) < 0
              ? 0
              : tags.findIndex(item => item.key === selectedTag.key)
          }
          modeConfig={{
            parallaxScrollingScale: 0.88,
            parallaxScrollingOffset: 70,
            parallaxAdjacentItemScale: 0.72,
          }}
          loop={!tags || tags?.length <= 2 ? false : true}
          width={windowWidth}
          height={'100%'}
          onSnapToItem={index => {
            if (!tags) {
              return;
            }
            setSelectedTag({ ...tags[index] });
          }}
          onProgressChange={(_: number, absoluteProgress: number) => {
            setIsScrolling(absoluteProgress % 1 !== 0);
          }}
          renderItem={({ item: tag }: any) => {
            return (
              <ContentContainer
                key={tag.key}
                style={{
                  transform: [{ translateY: -20 }],
                }}
              >
                <BasicCard
                  photoUrls={
                    (ageGroups &&
                      ageGroups[tag.key as TagKey]?.gallery.map(g => g.url)) ??
                    []
                  }
                  fallbackBackgroundColor={Color.WHITE}
                  fallbackBorderColor={Color.GREY_100}
                  fallbackIconName={'pictureNone'}
                  fallbackText={'사진이 없습니다'}
                  height={'100%'}
                  width={windowWidth}
                  onPress={() => {
                    const index =
                      ageGroups &&
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
