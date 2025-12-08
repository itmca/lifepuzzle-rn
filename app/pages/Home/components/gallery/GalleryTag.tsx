import { TagType } from '../../../../types/core/media.type';
import { Color } from '../../../../constants/color.constant.ts';
import Tag from '../../../../components/ui/display/Tag';
import { LayoutChangeEvent } from 'react-native';

type props = {
  item: TagType;
  index: number;
  selectedTag: TagType | null;
  onPress?: (index: number) => void;
  onLayout?: (event: LayoutChangeEvent) => void;
  showCount?: boolean;
  compact?: boolean;
};

const GalleryTag = ({
  item,
  index,
  selectedTag,
  onPress,
  onLayout,
  showCount = true,
  compact = false,
}: props) => {
  const paddingHorizontal = compact ? 11 : undefined;
  const paddingVertical = compact ? 5.5 : undefined;
  const getLabel = () =>
    showCount ? `${item.label} (${item.count ?? 0})` : item.label;

  if (selectedTag && selectedTag.key === item.key) {
    if (item.key === 'AI_PHOTO') {
      return (
        <Tag
          key={index}
          icon={'aiWhite'}
          iconColor={Color.WHITE}
          color={Color.AI_500}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          text={`${item.label}`}
          onLayout={onLayout}
        />
      );
    } else {
      return (
        <Tag
          key={index}
          color={Color.MAIN_DARK}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          text={getLabel()}
          onLayout={onLayout}
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
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          onPress={() => onPress?.(index)}
          text={`${item.label}`}
          onLayout={onLayout}
        />
      );
    } else {
      return (
        <Tag
          key={index}
          color={Color.GREY}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          onPress={() => onPress?.(index)}
          text={getLabel()}
          onLayout={onLayout}
        />
      );
    }
  }
};

export default GalleryTag;
