import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import { AdaptiveImage } from '../../ui/base/ImageBase';
import { VideoPlayer } from './StoryVideoPlayer';
import { ContentContainer } from '../../ui/layout/ContentContainer';
import { Color } from '../../../constants/color.constant';
import Carousel from 'react-native-reanimated-carousel';
import MediaCarouselPagination from './MediaCarouselPagination';
import { AiPhotoButton } from '../ai/AiPhotoButton';
import { BasicNavigationProps } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useCreateAiPhoto } from '../../../service/gallery/ai-photo.create.hook';

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
  height?: number;
};

const MediaCarouselComponent = ({
  data,
  activeIndex,
  carouselWidth,
  carouselMaxHeight = 376,
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
  const { submitWithErrorHandling: createAiPhoto } = useCreateAiPhoto({
    heroId: heroNo || 0,
    galleryId: galleryId || 0,
    drivingVideoId: drivingVideoId || 0,
  });

  // 이전 데이터 참조를 저장하여 불필요한 preload 방지
  const prevDataRef = useRef<MediaItem[]>([]);
  // 쓰로틀링을 위한 ref
  const lastScrollTimeRef = useRef<number>(0);

  // 모든 이미지를 미리 캐시에 로드 (데이터가 실제로 변경된 경우에만)
  useEffect(() => {
    // 데이터가 실제로 변경되었는지 확인
    if (JSON.stringify(prevDataRef.current) === JSON.stringify(data)) {
      return;
    }

    const imagesToPreload = data
      .filter(item => item.type === 'IMAGE' && item.url)
      .map(item => ({
        uri: item.url,
        priority: FastImage.priority.high,
      }));

    if (imagesToPreload.length > 0) {
      FastImage.preload(imagesToPreload);
    }

    prevDataRef.current = data;
  }, [data]);

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

      return (
        <ContentContainer flex={1} borderRadius={16} overflow="hidden">
          {type === 'VIDEO' && (
            <VideoPlayer
              videoUrl={mediaUrl}
              width={carouselWidth}
              activeMediaIndexNo={safeActiveIndex}
              setPaginationShown={setIsPaginationShown}
            />
          )}
          {type === 'IMAGE' && (
            <TouchableOpacity
              onPress={() => {
                onPress && onPress(mediaUrl);
              }}
              style={{
                flex: 1,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              <AdaptiveImage uri={mediaUrl} resizeMode="cover" />
            </TouchableOpacity>
          )}
          {showPagination && (
            <MediaCarouselPagination
              visible={isPaginationShown}
              activeMediaIndexNo={index}
              mediaCount={data.length}
            />
          )}
          {showAiPhotoButton && <AiPhotoButton onPress={handleAiPhotoPress} />}
        </ContentContainer>
      );
    },
    [
      safeActiveIndex,
      carouselWidth,
      isPaginationShown,
      data.length,
      onPress,
      handleAiPhotoPress,
      showAiPhotoButton,
      showPagination,
    ],
  );

  // 쓰로틀된 onScroll 핸들러 (100ms)
  const handleProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      if (!onScroll) return;

      const now = Date.now();
      if (now - lastScrollTimeRef.current >= 100) {
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
        windowSize={3}
        modeConfig={{
          parallaxScrollingScale: 0.91,
          parallaxAdjacentItemScale: 0.91,
          parallaxScrollingOffset: 25,
        }}
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
