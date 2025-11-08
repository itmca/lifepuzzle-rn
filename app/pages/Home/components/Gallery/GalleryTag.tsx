import {RefObject, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useRecoilState, useRecoilValue} from 'recoil';
import {BasicNavigationProps} from '../../../../navigation/types.tsx';
import {isLoggedInState} from '../../../../recoils/auth.recoil.ts';
import {
  ContentContainer,
  ScrollContentContainer,
} from '../../../../components/styled/container/ContentContainer.tsx';
import {ScrollView, useWindowDimensions} from 'react-native';
import {
  selectedGalleryIndexState,
  selectedTagState,
} from '../../../../recoils/photos.recoil.ts';
import {
  AgeGroupsType,
  AgeType,
  GalleryType,
  PhotoHeroType,
  TagType,
} from '../../../../types/photo.type.ts';
import {Color} from '../../../../constants/color.constant.ts';
import Tag from '../../../../components/styled/components/Tag.tsx';
import {Title} from '../../../../components/styled/components/Text.tsx';
import {NotificationBar} from '../../../../components/styled/components/NotificationBar.tsx';
import {BasicCard} from '../../../../components/card/Card.tsx';
import {SvgIcon} from '../../../../components/styled/components/SvgIcon.tsx';

type props = {
  carouselRef: RefObject<ICarouselInstance>;
  item: TagType;
  index: number;
};

const GalleryTag = ({carouselRef, item, index}: props) => {
  const [selectedTag, setSelectedTag] =
    useRecoilState<TagType>(selectedTagState);
  if (selectedTag && selectedTag.key === item.key) {
    if (item.key === 'AI_PHOTO') {
      return (
        <Tag
          key={index}
          icon={'aiWhite'}
          iconColor={Color.WHITE}
          color={Color.AI_500}
          text={`${item.label}`}
        />
      );
    } else {
      return (
        <Tag
          key={index}
          color={Color.MAIN_DARK}
          text={`${item.label} (${item.count ?? 0})`}
        />
      );
    }
  } else {
    if (item.key === 'AI_PHOTO') {
      return (
        <Tag
          key={index}
          icon={'aiSmall'}
          iconColor={Color.AI_500}
          color={Color.GREY}
          onPress={() => {
            carouselRef.current?.scrollTo({index});
            setSelectedTag({...item});
          }}
          text={`${item.label}`}
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
  }
};

export default GalleryTag;
