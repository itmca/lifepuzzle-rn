import {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useRecoilState, useRecoilValue} from 'recoil';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {isLoggedInState} from '../../recoils/auth.recoil.ts';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {ScrollView, useWindowDimensions} from 'react-native';
import {
  selectedGalleryIndexState,
  selectedTagState,
} from '../../recoils/photos.recoil.ts';
import {
  AgeGroupsType,
  AgeType,
  GalleryType,
  PhotoHeroType,
  TagType,
} from '../../types/photo.type.ts';
import {Color} from '../../constants/color.constant.ts';
import Tag from '../../components/styled/components/Tag.tsx';
import {Title} from '../../components/styled/components/Text.tsx';
import {NotificationBar} from '../../components/styled/components/NotificationBar.tsx';
import {BasicCard} from '../../components/card/Card.tsx';

type props = {
  hero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];
};

const Gallery = ({ageGroups, tags}: props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const carouselRef = useRef<ICarouselInstance>(null);
  const {width: windowWidth} = useWindowDimensions();
  const [selectedGalleryIndex, setSelectedGalleryIndex] =
    useRecoilState<number>(selectedGalleryIndexState);
  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [isScrolling, setIsScrolling] = useState(false);
  const moveToStoryListPage = (index: GalleryType['index']) => {
    if (!isScrolling) {
      navigation.push('NoTab', {
        screen: 'StoryViewNavigator',
        params: {
          screen: 'StoryList',
        },
      });
    }
  };
  const scrollRef = useRef<ScrollView>(null);
  const hasGallery =
    ageGroups &&
    Object.values(ageGroups).reduce((sum, item) => sum + item.galleryCount, 0) >
      0;
  useEffect(() => {
    const index = tags.findIndex(item => item.key === selectedTag.key);
    if (index < tags.length / 3) {
      scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
    } else if ((tags.length / 3) * 2 < index) {
      scrollRef.current?.scrollToEnd();
    }
  }, [selectedTag]);
  return (
    <ContentContainer flex={1}>
      <ContentContainer paddingHorizontal={20}>
        <NotificationBar text="나이대별 주인공의 사진/동영상을 추가해보세요" />
      </ContentContainer>
      <ContentContainer paddingLeft={20}>
        <ScrollContentContainer
          useHorizontalLayout
          gap={6}
          ref={scrollRef}
          paddingRight={20}>
          {tags.map((item: TagType, index) => {
            if (selectedTag && selectedTag.key === item.key) {
              return (
                <Tag
                  key={index}
                  color={Color.MAIN_DARK}
                  text={`${item.label} (${item.count ?? 0})`}
                />
              );
            } else {
              return (
                <Tag
                  key={index}
                  color={Color.GREY}
                  onPress={() => {
                    carouselRef.current?.scrollTo({index});
                    setSelectedTag({...item});
                  }}
                  text={`${item.label} (${item.count ?? 0})`}
                />
              );
            }
          })}
        </ScrollContentContainer>
      </ContentContainer>
      <ContentContainer
        flex={1}
        gap={0}
        alignItems={'center'}
        justifyContent={'flex-start'}>
        {hasGallery && (
          <ContentContainer paddingLeft={27}>
            <Title>{selectedTag.label}</Title>
          </ContentContainer>
        )}
        <Carousel
          ref={carouselRef}
          data={tags}
          mode={'parallax'}
          defaultIndex={
            tags.findIndex(item => item.key === selectedTag.key) < 0
              ? 0
              : tags.findIndex(item => item.key === selectedTag.key)
          }
          modeConfig={{
            parallaxScrollingScale: 0.88,
            parallaxScrollingOffset: 70,
            parallaxAdjacentItemScale: 0.75,
          }}
          loop={tags.length <= 2 ? false : true}
          width={windowWidth}
          height={'100%'}
          onSnapToItem={index => {
            setSelectedTag({...tags[index]});
          }}
          onProgressChange={(_: number, absoluteProgress: number) => {
            setIsScrolling(absoluteProgress % 1 !== 0);
          }}
          renderItem={({item: tag}: any) => {
            return (
              <ContentContainer
                style={{
                  transform: [{translateY: -20}],
                }}>
                <BasicCard
                  photoUrls={
                    ageGroups[tag.key as AgeType]?.gallery.map(g => g.url) ?? []
                  }
                  fallbackBackgroundColor={Color.WHITE}
                  fallbackBorderColor={Color.GREY_100}
                  fallbackIconName={'pictureNone'}
                  fallbackText={'사진이 없습니다'}
                  height={'100%'}
                  width={windowWidth}
                  onPress={() => {
                    const index =
                      ageGroups[tag.key as AgeType]?.gallery[0].index;
                    if (index) {
                      moveToStoryListPage(index);
                    }
                  }}
                />
              </ContentContainer>
            );
          }}
        />
      </ContentContainer>
    </ContentContainer>
  );
};

export default Gallery;
