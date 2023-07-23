import styled from 'styled-components/native';
import {DatePickerInput as Input} from 'react-native-paper-dates';
import {Button, Platform, View} from 'react-native';
import Text from './Text';
import React, {useState} from 'react';
import TextInput from './TextInput';
import {TextInput as ReactInput} from 'react-native-paper';
import RNDateTimePicker from 'react-native-modal-datetime-picker';

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
      return `${day}/${month}/${date.getFullYear()}`;
    }
  };
  const onDatePick = (selectedValue: Date) => {
    setVisible(Platform.OS === 'ios' ? true : false);
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
    <>
      <TextInput
        label={props.label}
        value={formatDate(date)}
        disabled={true}
        mode={'outlined'}
        right={<ReactInput.Icon icon="calendar" onPress={showPicker} />}
      />
      <RNDateTimePicker
        isVisible={visible}
        date={date}
        mode={'date'}
        display={'spinner'}
        onConfirm={onDatePick}
        onCancel={onCancel}
        locale="en"
      />
    </>
  );
}
export default DateInput;
