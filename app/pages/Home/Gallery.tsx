import {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';

import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {SelectedStoryKeyState} from '../../recoils/story-view.recoil.ts';
import {BasicNavigationProps} from '../../navigation/types.tsx';
import {isLoggedInState} from '../../recoils/auth.recoil.ts';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../components/styled/container/ContentContainer.tsx';
import {useWindowDimensions} from 'react-native';
import {
  selectedGalleryIndexState,
  selectedTagState,
} from '../../recoils/photos.recoil.ts';
import {
  AgeGroupsType,
  GalleryType,
  PhotoHeroType,
  TagType,
} from '../../types/photo.type.ts';
import {Color} from '../../constants/color.constant.ts';
import Tag from '../../components/styled/components/Tag.tsx';
import GalleryCard from './GalleryCard.tsx';
import {AgeGroupKeysWithoutTotalPhotos} from '../../service/hooks/photo.query.hook.ts';
import {SmallTitle} from '../../components/styled/components/Title.tsx';

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

  const moveToStoryDetailPage = (index: GalleryType['index']) => {
    setSelectedGalleryIndex(index);
    navigation.push('NoTab', {
      screen: 'StoryViewNavigator',
      params: {
        screen: isLoggedIn ? 'Story' : 'StoryDetailWithoutLogin',
      },
    });
  };

  return (
    <>
      <ContentContainer paddingHorizontal={20} gap={8}>
        <SmallTitle>
          나이대별 {hero?.nickname}의 사진/동영상을 추가해보세요
        </SmallTitle>
        <ScrollContentContainer useHorizontalLayout gap={6}>
          {tags.length > 0 &&
            tags.map((item, index) => {
              if (selectedTag && selectedTag.key == item.key) {
                return (
                  <Tag
                    key={index}
                    backgroundColor={Color.FONT_DARK}
                    fontWeight={'bold'}
                    fontColor={Color.WHITE}
                    text={item.label + '(' + (item.count ?? 0) + ')'}></Tag>
                );
              } else {
                return (
                  <Tag
                    key={index}
                    backgroundColor={Color.LIGHT_GRAY}
                    onPress={() => {
                      carouselRef.current?.scrollTo({index});
                      setSelectedTag(item);
                    }}
                    text={item.label + '(' + (item.count ?? 0) + ')'}></Tag>
                );
              }
            })}
        </ScrollContentContainer>
      </ContentContainer>
      <ContentContainer alignCenter flex={1} expandToEnd>
        {tags.length > 0 && (
          <Carousel
            ref={carouselRef}
            data={tags}
            mode={'parallax'}
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxAdjacentItemScale: 0.8,
              parallaxScrollingOffset: 60,
            }}
            width={windowWidth}
            loop={false}
            onSnapToItem={index => {
              setSelectedTag(tags[index]);
            }}
            renderItem={({item}: any) => {
              return (
                <GalleryCard
                  tag={item}
                  data={
                    ageGroups[item.key as AgeGroupKeysWithoutTotalPhotos]
                      ?.gallery ?? []
                  }
                  onClick={moveToStoryDetailPage}
                />
              );
            }}
          />
        )}
      </ContentContainer>
    </>
  );
};

export default Gallery;
