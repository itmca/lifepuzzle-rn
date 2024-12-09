import styled from 'styled-components/native';
import {DatePickerInput as Input} from 'react-native-paper-dates';
import {TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import TextInput from './TextInput';
import {TextInput as ReactInput} from 'react-native-paper';
import RNDateTimePicker from 'react-native-modal-datetime-picker';
import {MediumImage, SmallImage} from './Image';
import {ContentContainer} from '../container/ContentContainer.tsx';
import {styles} from '../../../pages/HeroModification/styles.ts';
import {XSmallTitle} from './Title.tsx';
import SelectDropdown from 'react-native-select-dropdown';

type Props = {
  width?: '100%';
  marginBottom?: number | 8;
};

const StyledDateInput = styled(Input).attrs(() => ({
  locale: 'en',
  inputMode: 'start',
  mode: 'outlined',
}))<Props>`
  width: ${({width}) => (width ? `${width}%` : '100%')};
  margin-bottom: ${({marginBottom}) =>
    marginBottom ? `${marginBottom}px` : '8px'};
`;

function DateInput({...props}) {
  const [visible, setVisible] = useState(false);
  const [date, onChangeDate] = useState<Date>(
    props.value ? new Date(props.value) : new Date(),
  );
  const showPicker = () => {
    setVisible(true);
  };
  const formatDate = (date: Date) => {
    if (date) {
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return `${date.getFullYear()}.${month}.${day}`;
    }
  };
  const onDatePick = (selectedValue: Date) => {
    setVisible(false);
    if (selectedValue) {
      const currentDate = selectedValue || new Date();
      onChangeDate(currentDate);
      props.onChange(currentDate);
    }
  };
  const onCancel = () => {
    setVisible(false);
  };

  return (
    <ContentContainer useHorizontalLayout>
      <ContentContainer
        width={'80px'}
        height={'56px'}
        borderRadius={4}
        alignCenter>
        <SelectDropdown
          data={[
            {label: '양력', value: 'SOLAR'},
            {label: '음력', value: 'LUNAR'},
          ]}
          onSelect={(selectedItem, index) => {}}
          renderButton={(selectedItem, isOpened) => {
            return (
              <ContentContainer>
                <ContentContainer
                  useHorizontalLayout
                  alignCenter
                  gap={0}
                  width={'80px'}>
                  <ContentContainer
                    width={'60px'}
                    flex={1}
                    alignCenter
                    expandToEnd>
                    <XSmallTitle>
                      {(selectedItem && selectedItem.label) || '양/음력'}
                    </XSmallTitle>
                  </ContentContainer>
                  <ContentContainer width={'20px'}>
                    <SmallImage
                      borderRadius={30}
                      source={
                        isOpened
                          ? require('../../../assets/images/expand_less.png')
                          : require('../../../assets/images/expand_more.png')
                      }
                    />
                  </ContentContainer>
                </ContentContainer>
              </ContentContainer>
            );
          }}
          dropdownStyle={styles.dropdownList}
          dropdownOverlayColor={'transparent'}
          renderItem={(item, index, isSelected) => {
            return (
              <ContentContainer>
                <ContentContainer
                  flex={1}
                  withContentPadding
                  gap={8}
                  alignCenter>
                  <XSmallTitle>{item.label}</XSmallTitle>
                </ContentContainer>
              </ContentContainer>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      </ContentContainer>
      <ContentContainer flex={1} expandToEnd>
        <TouchableOpacity onPress={showPicker}>
          <TextInput
            label={props.label}
            value={formatDate(date)}
            mode={'outlined'}
            disabled={true}
            onPress={showPicker}
            left={
              <ReactInput.Icon
                icon={() => (
                  <MediumImage
                    width={23}
                    height={23}
                    resizeMode={'contain'}
                    source={require('../../../assets/images/calendar.png')}
                  />
                )}
                onPress={showPicker}
              />
            }
          />
          <RNDateTimePicker
            isVisible={visible}
            date={date}
            mode={'date'}
            display={'spinner'}
            onConfirm={onDatePick}
            onCancel={onCancel}
            locale="ko"
            timeZoneName={'Asia/Seoul'}
          />
        </TouchableOpacity>
      </ContentContainer>
    </ContentContainer>
  );
}

export default DateInput;
