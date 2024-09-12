import styled from 'styled-components/native';
import {DatePickerInput as Input} from 'react-native-paper-dates';
import {TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import TextInput from './TextInput';
import {TextInput as ReactInput} from 'react-native-paper';
import RNDateTimePicker from 'react-native-modal-datetime-picker';
import {MediumImage} from './Image';

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
  );
}
export default DateInput;
