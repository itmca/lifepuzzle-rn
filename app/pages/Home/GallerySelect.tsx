import {ContentContainer} from '../../components/styled/container/ContentContainer.tsx';
import {TouchableOpacity} from 'react-native';
import {TagType} from '../../types/photo.type.ts';
import {Color} from '../../constants/color.constant.ts';
import {Caption} from '../../components/styled/components/Text.tsx';

type props = {
  item: TagType;
  index?: number;
  selected: boolean;
  onSelect: (item: TagType) => void;
};

const GallerySelect = ({item, index, selected, onSelect}: props) => {
  if (selected) {
    return (
      <TouchableOpacity onPress={() => onSelect(item)}>
        <ContentContainer
          height={40}
          paddingHorizontal={16}
          alignCenter
          backgroundColor={Color.SUB_TEAL}
          withBorder
          borderRadius={6}
          borderColor={Color.SUB_TEAL}>
          <Caption color={Color.WHITE}>{item.label}</Caption>
        </ContentContainer>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={() => onSelect(item)}>
        <ContentContainer
          height={40}
          paddingHorizontal={16}
          alignCenter
          backgroundColor={Color.GREY}
          withBorder
          borderRadius={6}
          borderColor={Color.GREY_100}>
          <Caption color={Color.GREY_600}>{item.label}</Caption>
        </ContentContainer>
      </TouchableOpacity>
    );
  }
};

export default GallerySelect;
