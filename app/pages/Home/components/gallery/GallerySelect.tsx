import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TagType } from '../../../../types/core/media.type';
import { Color } from '../../../../constants/color.constant.ts';
import { CaptionB } from '../../../../components/ui/base/TextBase';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer.tsx';

type props = {
  item: TagType;
  index?: number;
  selected: boolean;
  onSelect: (item: TagType) => void;
};

const GallerySelect = ({ item, index, selected, onSelect }: props) => {
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
          borderColor={Color.SUB_TEAL}
        >
          <CaptionB color={Color.WHITE}>{item.label}</CaptionB>
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
          borderColor={Color.GREY_100}
        >
          <CaptionB color={Color.GREY_600}>{item.label}</CaptionB>
        </ContentContainer>
      </TouchableOpacity>
    );
  }
};

export { GallerySelect };
