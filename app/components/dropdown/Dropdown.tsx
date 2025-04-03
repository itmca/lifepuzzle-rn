import React from 'react';
import {ContentContainer} from '../styled/container/ContentContainer.tsx';
import {Color} from '../../constants/color.constant.ts';
import SelectDropdown from 'react-native-select-dropdown';
import {SvgIcon} from '../styled/components/SvgIcon.tsx';
import {BodyTextM} from '../styled/components/Text.tsx';

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
  /*TODO(border-line): 동시 진행된 input 관련 PR 머지 후 Text의 color, Color.Transparent 등 적용*/
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
              width={typeof width === 'number' ? `${width}px` : width}
              gap={0}
              backgroundColor={mode === 'white' ? Color.WHITE : 'transparent'}>
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
        shadowOffset: {width: 0, height: 8},
        shadowRadius: 8,
        shadowOpacity: 0.04,
        width: width,
      }}
      dropdownOverlayColor={'transparent'}
      renderItem={item => {
        return (
          <ContentContainer>
            <ContentContainer
              width={typeof width === 'number' ? `${width}px` : width}
              paddingHorizontal={10}
              paddingVertical={10}
              backgroundColor={mode === 'white' ? Color.WHITE : 'transparent'}>
              <BodyTextM>{item.label}</BodyTextM>
            </ContentContainer>
          </ContentContainer>
        );
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};
