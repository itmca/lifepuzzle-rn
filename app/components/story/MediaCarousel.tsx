import {useState} from 'react';
import {Dimensions, StyleProp, ViewStyle} from 'react-native';
import {Photo} from '../styled/components/Image';
import {VideoPlayer} from './StoryVideoPlayer';
import {ContentContainer} from '../styled/container/ContentContainer';
import {LegacyColor} from '../../constants/color.constant';
import Carousel from 'react-native-reanimated-carousel';
import MediaCarouselPagination from './MediaCarouselPagination';

type Props = {
  data: MediaItem[];
  activeIndex?: number;
  carouselStyle?: StyleProp<ViewStyle>;
  carouselMaxHeight?: number;
  carouselWidth: number;
  isFocused?: boolean;
  onScroll?: (index: number) => void;
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
  carouselMaxHeight = Dimensions.get('window').height * 0.55,
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
    const index = item.index ?? -1;

    return (
      <ContentContainer flex={1} backgroundColor={LegacyColor.BLACK}>
        {type === 'VIDEO' && (
          <VideoPlayer
            videoUrl={mediaUrl}
            width={carouselWidth}
            activeMediaIndexNo={activeMediaIndexNo}
            setPaginationShown={setIsPaginationShown}
          />
        )}
        {type === 'IMAGE' && (
          <Photo
            resizeMode={'contain'}
            source={{
              uri: mediaUrl,
            }}
          />
        )}
        <MediaCarouselPagination
          visible={isPaginationShown}
          activeMediaIndexNo={index - 1}
          mediaCount={data.length}
        />
      </ContentContainer>
    );
  };

  return (
    <>
      <Carousel
        style={{alignSelf: 'center'}}
        loop={false}
        width={carouselWidth}
        height={300}
        data={data}
        defaultIndex={activeMediaIndexNo}
        renderItem={renderItem}
        onProgressChange={(_: number, absoluteProgress: number) => {
          onScroll && onScroll(Math.floor(absoluteProgress));
        }}
      />
    </>
  );
};
