import {useState} from 'react';
import {Dimensions, StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
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
  carouselMaxHeight?: number;
  carouselWidth: number;
  isFocused?: boolean;
  onScroll?: (index: number) => void;
  onPress?: (image: string) => void;
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
  onPress,
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
      <ContentContainer
        flex={1}
        backgroundColor={Color.GREY_700}
        borderRadius={6}>
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
            }}>
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
        height={376}
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
