import {useEffect, useState} from 'react';
import {Animated, Dimensions, Image, StyleProp, ViewStyle} from 'react-native';
import {Photo} from '../styled/components/Image';
import {VideoPlayer} from './StoryVideoPlayer';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import Carousel from 'react-native-reanimated-carousel';
import MediaCarouselPagination from './MediaCarouselPagination';
import {Container} from '../photo/styles';

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
    const height = item.height ?? 0;
    const index = item.index ?? -1;
    return (
      <ContentContainer flex={1} backgroundColor={Color.BLACK}>
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
    </>
  );
};
