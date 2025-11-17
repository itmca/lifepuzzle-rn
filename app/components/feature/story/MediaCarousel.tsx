import React, { useState } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Photo } from '../../ui/base/ImageBase';
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
  carouselStyle?: StyleProp<ViewStyle>;
  carouselMaxHeight?: number;
  carouselWidth: number;
  isFocused?: boolean;
  onScroll?: (index: number) => void;
  onPress?: (image: string) => void;
  heroNo?: number;
  galleryId?: number;
  drivingVideoId?: number;
};

type MediaItem = {
  type: string;
  url: string;
  index?: number;
  height?: number;
};

export const MediaCarousel = ({
  data,
  activeIndex,
  carouselWidth,
  carouselMaxHeight = 376,
  isFocused,
  onScroll,
  onPress,
  heroNo,
  galleryId,
  drivingVideoId,
}: Props): JSX.Element => {
  // React hooks
  const [activeMediaIndexNo, setActiveMediaIndexNo] = useState<number>(
    activeIndex ?? 0,
  );
  const [isPaginationShown, setIsPaginationShown] = useState<boolean>(true);

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  const {
    submitWithErrorHandling: createAiPhoto,
    isLoading: isCreatingAiPhoto,
  } = useCreateAiPhoto({
    heroNo: heroNo || 0,
    galleryId: galleryId || 0,
    drivingVideoId: drivingVideoId || 0,
  });

  const handleAiPhotoPress = async () => {
    // API 호출에 필요한 데이터가 없으면 기존처럼 바로 이동
    if (!heroNo || !galleryId || !drivingVideoId) {
      navigation.push('NoTab', {
        screen: 'AiPhotoNavigator',
        params: {
          screen: 'AiPhoto',
        },
      });
      return;
    }

    // API 호출하고 성공하면 자동으로 AiPhotoWorkHistory로 이동
    await createAiPhoto();
  };

  const renderItem = ({ item }: { item: MediaItem }) => {
    const type = item.type;
    const mediaUrl = item.url;
    const index = item.index ?? -1;

    return (
      <ContentContainer
        flex={1}
        backgroundColor={Color.GREY_700}
        borderRadius={6}
      >
        {type === 'VIDEO' && (
          <VideoPlayer
            videoUrl={mediaUrl}
            width={carouselWidth}
            activeMediaIndexNo={activeMediaIndexNo}
            setPaginationShown={setIsPaginationShown}
          />
        )}
        {type === 'IMAGE' && (
          <TouchableOpacity
            onPress={() => {
              onPress && onPress(mediaUrl);
            }}
          >
            <Photo
              resizeMode={'contain'}
              source={{
                uri: mediaUrl,
              }}
            />
          </TouchableOpacity>
        )}
        <MediaCarouselPagination
          visible={isPaginationShown}
          activeMediaIndexNo={index}
          mediaCount={data.length}
        />
        <AiPhotoButton onPress={handleAiPhotoPress} />
      </ContentContainer>
    );
  };

  return (
    <>
      <Carousel
        style={{ alignSelf: 'center' }}
        loop={false}
        width={carouselWidth}
        height={carouselMaxHeight}
        data={data}
        mode="parallax"
        windowSize={2}
        modeConfig={{
          parallaxScrollingScale: 0.91,
          parallaxAdjacentItemScale: 0.91,
          parallaxScrollingOffset: 25,
        }}
        defaultIndex={activeMediaIndexNo}
        renderItem={renderItem}
        onProgressChange={(_: number, absoluteProgress: number) => {
          onScroll && onScroll(Math.floor(absoluteProgress));
        }}
      />
    </>
  );
};
