import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';
import { Title } from '../../../../components/ui/base/TextBase';
import { SvgIcon } from '../../../../components/ui/display/SvgIcon';
import { Color } from '../../../../constants/color.constant';
import { TagType } from '../../../../types/core/media.type';

export interface TagSelectorProps {
  tags: TagType[];
  defaultIndex?: number;
  onSelect: (tag: TagType) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  defaultIndex,
  onSelect,
}) => {
  return (
    <SelectDropdown
      data={tags}
      defaultValueByIndex={
        defaultIndex !== undefined && defaultIndex >= 0
          ? defaultIndex
          : undefined
      }
      onSelect={(selectedItem, _) => {
        onSelect(selectedItem);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <ContentContainer
            gap={8}
            style={{
              height: 24,
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
          >
            <Title
              color={
                selectedItem && selectedItem.label
                  ? Color.GREY_700
                  : Color.GREY_400
              }
            >
              {(selectedItem && selectedItem.label) || '나이대'}
            </Title>
            <SvgIcon name={isOpened ? 'chevronUp' : 'chevronDown'} />
          </ContentContainer>
        );
      }}
      dropdownStyle={{
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        width: 70,
      }}
      dropdownOverlayColor={'transparent'}
      renderItem={(item, _index, _isSelected) => {
        return (
          <ContentContainer withContentPadding gap={8}>
            <Title color={Color.GREY_700}>{item.label}</Title>
          </ContentContainer>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};
