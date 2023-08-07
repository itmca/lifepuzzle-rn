import React, {useState} from 'react';
import {
  Dimensions,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {styles} from './styles';
import StoryCarouselPagination from './StoryCarouselPagination';
import {Photo} from '../styled/components/Image';

type Props = {
  photos: string[];
  containerStyle?: StyleProp<ViewStyle>;
  carouselStyle?: StyleProp<ViewStyle>;
  carouselWidth?: number;
};

const StoryPhotoCarousel = ({
  photos,
  containerStyle,
  carouselStyle,
  carouselWidth,
}: Props): JSX.Element => {
  const [activePhotoIndexNo, setActivePhotoIndexNo] = useState<number>(0);

  if (!photos || photos.length === 0) {
    return <></>;
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View style={containerStyle}>
      <Carousel
        data={photos}
        sliderWidth={carouselWidth ?? windowWidth}
        sliderHeight={windowHeight}
        itemWidth={windowWidth}
        itemHeight={windowHeight}
        containerCustomStyle={carouselStyle}
        renderItem={({item: photo}: ListRenderItemInfo<string>) => {
          return (
            <Photo
              source={{
                uri: photo,
              }}
            />
          );
        }}
        onSnapToItem={setActivePhotoIndexNo}
      />
      <StoryCarouselPagination
        activePhotoIndexNo={activePhotoIndexNo}
        photoCount={photos.length}
        containerStyle={{bottom: 12, position: 'absolute'}}
      />
    </View>
  );
};

export default StoryPhotoCarousel;
