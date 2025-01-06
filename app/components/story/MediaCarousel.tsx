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
  const DeviceWidth = Dimensions.get('window').width;

  const [carouselHeight, setCarouselHeight] = useState(new Animated.Value(200));
  const [mediaWithSizes, setMediaWithSizes] = useState<MediaItem[]>([]);

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
      <ContentContainer
        flex={1}
        backgroundColor={Color.GRAY}
        style={{
          borderBottomWidth: 0.8,
          borderBottomColor: Color.GRAY,
        }}>
        {type === 'VIDEO' && (
          <VideoPlayer
            videoUrl={mediaUrl}
            isFocused={isFocused}
            width={carouselWidth}
            activeMediaIndexNo={activeMediaIndexNo}
            setPaginationShown={setIsPaginationShown}
            onLoad={metadata =>
              updateVideoHeight(
                index,
                metadata.naturalSize.width,
                metadata.naturalSize.height,
              )
            }
          />
        )}
        {type === 'IMAGE' && (
          <Photo
            resizeMode={height < carouselMaxHeight ? 'center' : 'contain'}
            source={{
              uri: mediaUrl,
            }}
          />
        )}
      </ContentContainer>
    );
  };
  const animateHeight = async (index: number) => {
    const newHeight = mediaWithSizes[index]?.height || 200;
    await Animated.timing(carouselHeight, {
      toValue: newHeight,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const updateVideoHeight = (index: number, width: number, height: number) => {
    setMediaWithSizes(
      mediaWithSizes.map(item =>
        item.index === index
          ? {...item, height: (height / width) * DeviceWidth}
          : item,
      ),
    );
  };
  useEffect(() => {
    const fetchMediaSizes = async () => {
      const promises = data.map(
        (item, index) =>
          new Promise(resolve => {
            if (item.type === 'IMAGE') {
              // 이미지 크기 가져오기
              Image.getSize(
                item.url,
                (width, height) => {
                  const scaledHeight = (height / width) * DeviceWidth; // 비율 조정

                  let carousel =
                    height < carouselMaxHeight
                      ? {width, height}
                      : {
                          width: (width * carouselMaxHeight) / height,
                          height: carouselMaxHeight,
                        };
                  const carouselWidth =
                    height < carouselMaxHeight
                      ? width
                      : (width * carouselMaxHeight) / height;
                  if (carousel.width > DeviceWidth) {
                    carousel = {
                      width: DeviceWidth,
                      height: (carouselWidth * height) / width,
                    };
                  }
                  resolve({...item, height: carousel.height, index});
                },
                error => {
                  console.error('이미지 로드 에러:', error);
                  resolve({...item, height: 200, index}); // 기본 높이 설정
                },
              );
            } else if (item.type === 'VIDEO') {
              // 동영상은 기본 높이 사용 (사용자 정의 가능)
              resolve({...item, height: 300, index});
            } else {
              resolve({...item, height: 300, index});
            }
          }),
      );
      const results = await Promise.all(promises);
      setMediaWithSizes(results);
    };
    fetchMediaSizes();
  }, [data]);
  useEffect(() => {
    animateHeight(activeMediaIndexNo);
  }, [mediaWithSizes]);
  return (
    <Animated.View style={{height: carouselHeight}}>
      <Carousel
        style={{alignSelf: 'center'}}
        loop={false}
        width={carouselWidth}
        height={Number(carouselHeight)}
        data={mediaWithSizes}
        defaultIndex={activeMediaIndexNo}
        renderItem={renderItem}
        onSnapToItem={index => {
          animateHeight(index);
          setActiveMediaIndexNo(index);
          onScroll && onScroll(index);
        }}
      />
      <MediaCarouselPagination
        visible={isPaginationShown}
        activeMediaIndexNo={activeMediaIndexNo}
        mediaCount={data.length}
      />
    </Animated.View>
  );
};
