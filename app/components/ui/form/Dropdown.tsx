import React from 'react';
import { ContentContainer } from '../layout/ContentContainer';
import { Color } from '../../../constants/color.constant.ts';
import SelectDropdown from 'react-native-select-dropdown';
import { SvgIcon } from '../display/SvgIcon.tsx';
import { BodyTextM } from '../base/TextBase';

type DropdownOption = {
  label: string;
  value: string;
};

type DropdownProps = {
  mode?: 'transparent' | 'white';
  defaultValue: string;
  options: DropdownOption[];
  onSelect: (option: DropdownOption) => void;
  width?: number | 'auto' | `${number}%`;
};

export const Dropdown = ({
  mode = 'transparent',
  defaultValue,
  options,
  onSelect,
  width = 60,
}: DropdownProps) => {
  return (
    <SelectDropdown
      data={options}
      defaultValue={options.find(option => option.value === defaultValue)}
      onSelect={selectedItem => {
        if (onSelect === undefined) {
          return;
        }

        onSelect(selectedItem);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <ContentContainer>
            <ContentContainer
              useHorizontalLayout
              width={width}
              gap={0}
              backgroundColor={
                mode === 'white' ? Color.WHITE : Color.TRANSPARENT
              }
            >
              <ContentContainer flex={1} alignCenter expandToEnd>
                <BodyTextM>{selectedItem && selectedItem.label}</BodyTextM>
              </ContentContainer>
              <SvgIcon
                name={isOpened ? 'chevronUp' : 'chevronDown'}
                size={24}
              />
            </ContentContainer>
          </ContentContainer>
        );
      }}
      dropdownStyle={{
        backgroundColor: Color.WHITE,
        borderColor: Color.GREY,
        borderWidth: 1,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        shadowColor: Color.BLACK,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 8,
        shadowOpacity: 0.04,
        width: width,
      }}
      dropdownOverlayColor={Color.TRANSPARENT}
      renderItem={item => {
        return (
          <ContentContainer>
            <ContentContainer
              width={width}
              paddingHorizontal={10}
              paddingVertical={10}
              backgroundColor={
                mode === 'white' ? Color.WHITE : Color.TRANSPARENT
              }
            >
              <BodyTextM>{item.label}</BodyTextM>
            </ContentContainer>
          </ContentContainer>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};
