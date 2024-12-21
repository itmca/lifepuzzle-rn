import {useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Photo} from '../styled/components/Image';
import {VideoPlayer} from './StoryVideoPlayer';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import Carousel from 'react-native-reanimated-carousel';
import MediaCarouselPagination from './MediaCarouselPagination';

type Props = {
  data: MediaItem[];
  activeIndex?: number;
  carouselStyle?: StyleProp<ViewStyle>;
  carouselHeight: number;
  carouselWidth: number;
  isFocused?: boolean;
  onScroll?: (index: number) => void;
};

type MediaItem = {
  type: string;
  url: string;
};

export const MediaCarousel = ({
  data,
  activeIndex,
  carouselWidth,
  carouselHeight,
  isFocused,
  onScroll,
}: Props): JSX.Element => {
  const [activeMediaIndexNo, setActiveMediaIndexNo] = useState<number>(
    activeIndex ?? 0,
  );
  const [isPaginationShown, setIsPaginationShown] = useState<boolean>(true);

  const renderItem = ({item}: {item: MediaItem}) => {
    const type = item.type;
    const mediaUrl = item.url;

    return (
      <>
        {type === 'video' && (
          <VideoPlayer
            videoUrl={mediaUrl}
            isFocused={isFocused}
            width={carouselWidth}
            activeMediaIndexNo={activeMediaIndexNo}
            setPaginationShown={setIsPaginationShown}
          />
        )}
        {type === 'photo' && (
          <Photo
            resizeMode="cover"
            source={{
              uri: mediaUrl,
            }}
          />
        )}
      </>
    );
  };

  return (
    <ContentContainer
      backgroundColor={Color.BLACK}
      style={{
        borderBottomWidth: 0.8,
        borderBottomColor: Color.GRAY,
      }}>
      <Carousel
        style={{alignSelf: 'center'}}
        loop={false}
        width={carouselWidth}
        height={carouselHeight}
        data={data}
        defaultIndex={activeMediaIndexNo}
        renderItem={renderItem}
        onSnapToItem={index => {
          setActiveMediaIndexNo(index);
          onScroll && onScroll(index);
        }}
      />
      <MediaCarouselPagination
        visible={isPaginationShown}
        activeMediaIndexNo={activeMediaIndexNo}
        mediaCount={data.length}
      />
    </ContentContainer>
  );
};
