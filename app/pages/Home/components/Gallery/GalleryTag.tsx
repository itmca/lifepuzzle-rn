import {RefObject} from 'react';

import {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useRecoilState} from 'recoil';
import {selectionState} from '../../../../recoils/ui/selection.recoil';
import {TagType} from '../../../../types/photo.type.ts';
import {Color} from '../../../../constants/color.constant.ts';
import Tag from '../../../../components/ui/display/Tag';

type props = {
  carouselRef: RefObject<ICarouselInstance>;
  item: TagType;
  index: number;
};

const GalleryTag = ({carouselRef, item, index}: props) => {
  const [selection, setSelection] = useRecoilState(selectionState);
  const selectedTag = selection.tag;
  const setSelectedTag = (tag: TagType) =>
    setSelection(prev => ({...prev, tag}));
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
