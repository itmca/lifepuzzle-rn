import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Photo} from '../styled/components/Image';
import {StoryType} from '../../types/story.type';
import {VideoPlayer} from './StoryVideoPlayer';
import {ContentsOnThumbnail} from '../story-list/StoryItemContentsOnThumbnail';
import StoryMediaCarouselPagination from './StoryMediaCarauselPagination';
import {ContentContainer} from '../styled/container/ContentContainer';

type Props = {
  story: StoryType;
  carouselStyle?: StyleProp<ViewStyle>;
  carouselWidth?: number;
};

type MediaItem = {
  mediaType: string;
  url: string;
};

const StoryMediaCarousel = ({
  story,
  carouselStyle,
  carouselWidth,
}: Props): JSX.Element => {
  const data: MediaItem[] = [
    ...story.videos.map(url => ({mediaType: 'video', url: url})),
    ...story.audios.map(url => ({mediaType: 'audio', url: url})),
    ...story.photos.map(url => ({mediaType: 'photo', url: url})),
  ];

  const [activeMediaIndexNo, setActiveMediaIndexNo] = useState<number>(0);
  const [isClicked, setClicked] = useState<boolean>(false);
  const [isPaused, setPaused] = useState<boolean>(true);
  const [playingTime, setPlayingTime] = useState<string>('');
  const [isControlShown, setIsControlShown] = useState<boolean>(false);

  useEffect(() => {
    story.playingTime = playingTime;
  }, [playingTime]);

  useEffect(() => {
    if (activeMediaIndexNo > 1) {
      setClicked(false);
      setIsControlShown(false);
    }
  }, [activeMediaIndexNo]);

  const renderItem = ({item}: {item: MediaItem}) => {
    const mediaType = item.mediaType;
    const mediaUrl = item.url;

    if (mediaType === 'video') {
      return (
        <>
          <VideoPlayer
            videoUrl={mediaUrl}
            isPaused={isPaused}
            isControlShown={isControlShown}
            playingTime={playingTime}
            setPaused={setPaused}
            setClicked={setClicked}
            setPlayingTime={setPlayingTime}
            setIsControlShown={setIsControlShown}
          />
          <TouchableOpacity
            style={
              isClicked
                ? {display: 'none'}
                : {
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    gap: 6,
                  }
            }
            onPressIn={() => {
              if (!isClicked) {
                setClicked(true);
                setIsControlShown(true);
              }
            }}>
            <ContentsOnThumbnail story={story} mediaType={mediaType} />
          </TouchableOpacity>
        </>
      );
    } else if (mediaType === 'audio') {
      return (
        <>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: 160,
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              backgroundColor: '#03ACEE',
            }}
          />
          <ContentsOnThumbnail story={story} mediaType={mediaType} />
        </>
      );
    } else if (mediaType === 'photo') {
      return (
        <Photo
          backgroundColor="#d9d9d9"
          borderTopLeftRadius={6}
          borderTopRightRadius={6}
          resizeMode="cover"
          source={{
            uri: mediaUrl,
          }}
        />
      );
    }

    return null;
  };

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <ContentContainer>
      <Carousel
        data={data}
        sliderWidth={carouselWidth ? carouselWidth : windowWidth}
        sliderHeight={windowHeight}
        itemWidth={carouselWidth ? carouselWidth : windowWidth}
        itemHeight={windowHeight}
        containerCustomStyle={carouselStyle}
        renderItem={renderItem}
        onSnapToItem={setActiveMediaIndexNo}
      />
      <StoryMediaCarouselPagination
        activeMediaIndexNo={activeMediaIndexNo}
        mediaCount={data.length}
        containerStyle={{width: carouselWidth}}
      />
    </ContentContainer>
  );
};

export default StoryMediaCarousel;
