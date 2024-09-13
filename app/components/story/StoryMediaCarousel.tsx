import React, {useState} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {Photo} from '../styled/components/Image';
import {StoryType} from '../../types/story.type';
import {VideoPlayer} from './StoryVideoPlayer';
import StoryMediaCarouselPagination from './StoryMediaCarauselPagination';
import {ContentContainer} from '../styled/container/ContentContainer';
import {Color} from '../../constants/color.constant';
import {StoryAudioPlayer} from './StoryAudioPlayer';
import Carousel from 'react-native-reanimated-carousel';

type Props = {
  story: StoryType;
  carouselStyle?: StyleProp<ViewStyle>;
  carouselHeight: number;
  carouselWidth: number;
  isFocused?: boolean;
};

type MediaItem = {
  mediaType: string;
  url: string;
};

export const StoryMediaCarousel = ({
  story,
  carouselWidth,
  carouselHeight,
  isFocused,
}: Props): JSX.Element => {
  const [activeMediaIndexNo, setActiveMediaIndexNo] = useState<number>(0);
  const [isPaginationShown, setIsPaginationShown] = useState<boolean>(true);

  const data: MediaItem[] = [
    ...story.videos.map(url => ({mediaType: 'video', url: url})),
    ...story.photos.map(url => ({mediaType: 'photo', url: url})),
    ...story.audios.map(url => ({mediaType: 'audio', url: url})),
  ];

  const renderItem = ({item}: {item: MediaItem}) => {
    const mediaType = item.mediaType;
    const mediaUrl = item.url;

    return (
      <>
        {mediaType === 'video' && (
          <VideoPlayer
            videoUrl={mediaUrl}
            isFocused={isFocused}
            width={carouselWidth}
            activeMediaIndexNo={activeMediaIndexNo}
            setPaginationShown={setIsPaginationShown}
          />
        )}
        {mediaType === 'audio' && (
          <StoryAudioPlayer
            audioURL={mediaUrl}
            isFocused={isFocused}
            activeMediaIndexNo={activeMediaIndexNo}
          />
        )}
        {mediaType === 'photo' && (
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
      style={{
        borderBottomWidth: 0.8,
        borderBottomColor: Color.GRAY,
      }}>
      <Carousel
        loop={false}
        width={carouselWidth}
        height={carouselHeight}
        data={data}
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
