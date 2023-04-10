import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {styles} from './styles';
import StoryCarouselPagination from './StoryCarouselPagination';

type Props = {
  photos: string[];
  containerStyle?: StyleProp<ViewStyle>;
};

const StoryPhotoCarousel = ({photos, containerStyle}: Props): JSX.Element => {
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
        sliderWidth={windowWidth}
        sliderHeight={windowHeight}
        itemWidth={windowWidth}
        itemHeight={windowHeight}
        renderItem={({item: photo}: ListRenderItemInfo<string>) => {
          return (
            <Image
              style={styles.photo}
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
