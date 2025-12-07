import { useSelectionStore } from '../../../../stores/selection.store';
import { TagType } from '../../../../types/core/media.type';
import { Color } from '../../../../constants/color.constant.ts';
import Tag from '../../../../components/ui/display/Tag';

type props = {
  item: TagType;
  index: number;
  onPress?: (index: number) => void;
  showCount?: boolean;
  compact?: boolean;
};

const GalleryTag = ({
  item,
  index,
  onPress,
  showCount = true,
  compact = false,
}: props) => {
  const { selectedTag, setSelectedTag } = useSelectionStore();
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
          onPress={() => {
            onPress?.(index);
            setSelectedTag({ ...item });
          }}
          text={`${item.label}`}
        />
      );
    } else {
      return (
        <Tag
          key={index}
          color={Color.GREY}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          onPress={() => {
            onPress?.(index);
            setSelectedTag({ ...item });
          }}
          text={getLabel()}
        />
      );
    }
  }
};

export default GalleryTag;
