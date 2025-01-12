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
import GalleryCard from './GalleryCard.tsx';
import {AgeGroupKeysWithoutTotalPhotos} from '../../service/hooks/photo.query.hook.ts';
import {SmallTitle} from '../../components/styled/components/Title.tsx';
import {useAnimatedScrollHandler} from 'react-native-reanimated';

type props = {
  hero: PhotoHeroType;
  ageGroups: AgeGroupsType;
  tags: TagType[];
};

const Gallery = ({hero, ageGroups, tags}: props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  const carouselRef = useRef<ICarouselInstance>(null);
  const {width: windowWidth} = useWindowDimensions();
  const [selectedGalleryIndex, setSelectedGalleryIndex] =
    useRecoilState<number>(selectedGalleryIndexState);
  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [isScrolling, setIsScrolling] = useState(false);
  const moveToStoryDetailPage = (index: GalleryType['index']) => {
    if (!isScrolling) {
      setSelectedGalleryIndex(index - 1);
      navigation.push('NoTab', {
        screen: 'StoryViewNavigator',
        params: {
          screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
        },
      });
    }
  };
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    const index = tags.findIndex(item => item.key === selectedTag.key);
    if (index < tags.length / 3) {
      scrollRef.current?.scrollTo({x: 0, y: 0, animated: true});
    } else if ((tags.length / 3) * 2 < index) {
      scrollRef.current?.scrollToEnd();
    }
  }, [selectedTag]);
  return (
    <ContentContainer flex={1} gap={0}>
      <ContentContainer paddingHorizontal={20} gap={8}>
        <SmallTitle>
          나이대별 {hero?.nickname}의 사진/동영상을 추가해보세요
        </SmallTitle>
        <ScrollContentContainer useHorizontalLayout gap={6} ref={scrollRef}>
          {tags.map((item: TagType, index) => {
            if (selectedTag && selectedTag.key === item.key) {
              return (
                <Tag
                  key={index}
                  backgroundColor={Color.FONT_DARK}
                  fontWeight={'bold'}
                  fontColor={Color.WHITE}
                  text={`${item.label} (${item.count ?? 0})`}></Tag>
              );
            } else {
              return (
                <Tag
                  key={index}
                  backgroundColor={Color.LIGHT_GRAY}
                  onPress={() => {
                    carouselRef.current?.scrollTo({index});
                    setSelectedTag({...item});
                  }}
                  text={`${item.label} (${item.count ?? 0})`}></Tag>
              );
            }
          })}
        </ScrollContentContainer>
      </ContentContainer>
      <ContentContainer flex={1}>
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
            parallaxScrollingScale: 0.9,
            parallaxAdjacentItemScale: 0.8,
            parallaxScrollingOffset: 60,
          }}
          loop={tags.length <= 2 ? false : true}
          width={windowWidth}
          onSnapToItem={index => {
            setSelectedTag({...tags[index]});
          }}
          onProgressChange={(_: number, absoluteProgress: number) => {
            setIsScrolling(absoluteProgress % 1 !== 0);
          }}
          renderItem={({item}: any) => {
            return (
              <GalleryCard
                tag={item}
                data={ageGroups[item.key as AgeType]?.gallery ?? []}
                onClick={moveToStoryDetailPage}
              />
            );
          }}
        />
      </ContentContainer>
    </ContentContainer>
  );
};

export default Gallery;
