import React, {useState} from 'react';
import {Dimensions, StyleProp, ViewStyle} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Photo} from '../styled/components/Image';
import {StoryType} from '../../types/story.type';
import {VideoPlayer} from './StoryVideoPlayer';
import StoryMediaCarouselPagination from './StoryMediaCarauselPagination';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {StoryAudioPlayer} from './StoryAudioPlayer';

type Props = {
  story: StoryType;
  carouselStyle?: StyleProp<ViewStyle>;
  carouselWidth?: number;
  listThumbnail?: boolean;
};

type MediaItem = {
  mediaType: string;
  url: string;
};

const StoryMediaCarousel = ({
  story,
  carouselStyle,
  carouselWidth,
  listThumbnail,
}: Props): JSX.Element => {
  const [activeMediaIndexNo, setActiveMediaIndexNo] = useState<number>(0);
  const [isPaginationShown, setIsPaginationShown] = useState<boolean>(true);

  const data: MediaItem[] = [
    ...story.videos.map(url => ({mediaType: 'video', url: url})),
    ...story.audios.map(url => ({mediaType: 'audio', url: url})),
    ...story.photos.map(url => ({mediaType: 'photo', url: url})),
  ];

  const renderItem = ({item}: {item: MediaItem}) => {
    const mediaType = item.mediaType;
    const mediaUrl = item.url;

    return (
      <>
        {mediaType === 'video' && (
          <VideoPlayer
            listThumbnail={listThumbnail ? listThumbnail : false}
            videoUrl={mediaUrl}
            setIsPaginationShown={setIsPaginationShown}
          />
        )}
        {mediaType === 'audio' && (
          <StoryAudioPlayer
            listThumbnail={listThumbnail ? listThumbnail : false}
            audioURL={mediaUrl}
          />
        )}
        {mediaType === 'photo' && (
          <Photo
            borderTopLeftRadius={listThumbnail ? 6 : 0}
            borderTopRightRadius={listThumbnail ? 6 : 0}
            resizeMode="cover"
            source={{
              uri: mediaUrl,
            }}
          />
        )}
      </>
    );
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <ContentContainer
      height={listThumbnail ? '160px' : '200px'}
      justifyContent="center"
      alignItems="center"
      listThumbnail={listThumbnail ? listThumbnail : true}
      style={{
        borderBottomWidth: 0.8,
        borderBottomColor: Color.GRAY,
      }}>
      <Carousel
        data={data}
        sliderHeight={windowHeight}
        itemHeight={windowHeight}
        sliderWidth={carouselWidth ? carouselWidth : windowWidth}
        itemWidth={carouselWidth ? carouselWidth : windowWidth}
        containerCustomStyle={carouselStyle}
        renderItem={renderItem}
        onSnapToItem={setActiveMediaIndexNo}
      />
      <StoryMediaCarouselPagination
        visible={isPaginationShown}
        activeMediaIndexNo={activeMediaIndexNo}
        mediaCount={data.length}
        containerStyle={{width: carouselWidth}}
      />
    </ContentContainer>
  );
};

export default StoryMediaCarousel;
