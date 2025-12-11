import React, { useCallback, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AdaptiveImage } from '../../ui/base/ImageBase';
import { VideoPlayer } from './StoryVideoPlayer';
import { ContentContainer } from '../../ui/layout/ContentContainer';
import {
  CAROUSEL_MODE_CONFIG,
  CAROUSEL_SCROLL_THROTTLE_MS,
  CAROUSEL_WINDOW_SIZE,
  DEFAULT_CAROUSEL_HEIGHT,
} from '../../../constants/carousel.constant';
import { calculateContainDimensions } from '../../../utils/carousel-dimension.util';
import Carousel from 'react-native-reanimated-carousel';
import MediaCarouselPagination from './MediaCarouselPagination';
import { AiPhotoButton } from '../ai/AiPhotoButton';
import { BasicNavigationProps } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useCreateAiPhoto } from '../../../services/gallery/gallery.mutation';
import { useImagePreloader } from '../../../hooks/useImagePreloader';

type Props = {
  data: MediaItem[];
  activeIndex?: number;
  carouselMaxHeight?: number;
  carouselWidth: number;
  onScroll?: (index: number) => void;
  onPress?: (image: string) => void;
  heroNo?: number;
  galleryId?: number;
  drivingVideoId?: number;
  showAiPhotoButton?: boolean;
  showPagination?: boolean;
};

type MediaItem = {
  type: string;
  url: string;
  index?: number;
  width?: number;
  height?: number;
};

const MediaCarouselComponent = ({
  data,
  activeIndex,
  carouselWidth,
  carouselMaxHeight = DEFAULT_CAROUSEL_HEIGHT,
  onScroll,
  onPress,
  heroNo,
  galleryId,
  drivingVideoId,
  showAiPhotoButton = true,
  showPagination = true,
}: Props): React.ReactElement => {
  // React hooks
  const [isPaginationShown, setIsPaginationShown] = useState<boolean>(true);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();
  const safeActiveIndex = Math.min(
    Math.max(activeIndex ?? 0, 0),
    Math.max(data.length - 1, 0),
  );

  // Custom hooks
  const { createAiPhotoWithErrorHandling: createAiPhoto } = useCreateAiPhoto({
    heroId: heroNo || 0,
    galleryId: galleryId || 0,
    drivingVideoId: drivingVideoId || 0,
  });

  // 쓰로틀링을 위한 ref
  const lastScrollTimeRef = useRef<number>(0);

  // Use custom hook for image preloading
  useImagePreloader(data);

  const handleAiPhotoPress = useCallback(async () => {
    // API 호출에 필요한 데이터가 없으면 기존처럼 바로 이동
    if (!heroNo || !galleryId || !drivingVideoId) {
      navigation.navigate('App', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhoto',
        },
      });
      return;
    }

    // API 호출하고 성공하면 자동으로 AiPhotoWorkHistory로 이동
    await createAiPhoto();
  }, [heroNo, galleryId, drivingVideoId, navigation, createAiPhoto]);

  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => {
      const type = item.type;
      const mediaUrl = item.url;
      const index = item.index ?? -1;

      // 이미지 실제 표시 크기 계산 (contain 모드)
      const displayDimensions =
        type === 'IMAGE' && item.width && item.height
          ? calculateContainDimensions(
              item.width,
              item.height,
              carouselWidth,
              carouselMaxHeight,
            )
          : { width: carouselWidth, height: carouselMaxHeight };

      const displayWidth = displayDimensions.width;
      const displayHeight = displayDimensions.height;

      return (
        <ContentContainer flex={1} alignItems="center" justifyContent="center">
          {type === 'VIDEO' && (
            <ContentContainer borderRadius={16} overflow="hidden">
              <VideoPlayer
                videoUrl={mediaUrl}
                width={carouselWidth}
                activeMediaIndexNo={safeActiveIndex}
                setPaginationShown={setIsPaginationShown}
              />
            </ContentContainer>
          )}
          {type === 'IMAGE' && (
            <TouchableOpacity
              onPress={() => {
                onPress && onPress(mediaUrl);
              }}
              activeOpacity={0.9}
            >
              <View
                style={{
                  width: displayWidth,
                  height: displayHeight,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                <AdaptiveImage
                  uri={mediaUrl}
                  resizeMode="contain"
                  borderRadius={0}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
            </TouchableOpacity>
          )}
          {showPagination && (
            <MediaCarouselPagination
              visible={isPaginationShown}
              activeMediaIndexNo={index}
              mediaCount={data.length}
            />
          )}
          {showAiPhotoButton && (
            <AiPhotoButton onPress={handleAiPhotoPress} bottomPadding={8} />
          )}
        </ContentContainer>
      );
    },
    [
      safeActiveIndex,
      carouselWidth,
      carouselMaxHeight,
      isPaginationShown,
      data.length,
      onPress,
      handleAiPhotoPress,
      showAiPhotoButton,
      showPagination,
    ],
  );

  // 쓰로틀된 onScroll 핸들러
  const handleProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      if (!onScroll) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current >= CAROUSEL_SCROLL_THROTTLE_MS) {
        lastScrollTimeRef.current = now;
        onScroll(Math.floor(absoluteProgress));
      }
    },
    [onScroll],
  );

  // 스냅 완료 시 호출되는 핸들러
  const handleSnapToItem = useCallback(
    (index: number) => {
      if (onScroll) {
        onScroll(index);
      }
    },
    [onScroll],
  );

  return (
    <>
      <Carousel
        style={{ alignSelf: 'center' }}
        loop={false}
        width={carouselWidth}
        height={carouselMaxHeight}
        data={data}
        mode="parallax"
        windowSize={CAROUSEL_WINDOW_SIZE}
        modeConfig={CAROUSEL_MODE_CONFIG}
        defaultIndex={safeActiveIndex}
        renderItem={renderItem}
        onProgressChange={handleProgressChange}
        onSnapToItem={handleSnapToItem}
      />
    </>
  );
};

// React.memo로 불필요한 재렌더링 방지
export const MediaCarousel = React.memo(
  MediaCarouselComponent,
  (prevProps, nextProps) => {
    // 커스텀 비교 함수로 props 변경 여부 확인
    return (
      prevProps.data === nextProps.data &&
      prevProps.activeIndex === nextProps.activeIndex &&
      prevProps.carouselWidth === nextProps.carouselWidth &&
      prevProps.carouselMaxHeight === nextProps.carouselMaxHeight &&
      prevProps.onScroll === nextProps.onScroll &&
      prevProps.onPress === nextProps.onPress &&
      prevProps.heroNo === nextProps.heroNo &&
      prevProps.galleryId === nextProps.galleryId &&
      prevProps.drivingVideoId === nextProps.drivingVideoId &&
      prevProps.showAiPhotoButton === nextProps.showAiPhotoButton &&
      prevProps.showPagination === nextProps.showPagination
    );
  },
);
