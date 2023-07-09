import {
  Button,
  I18nManager,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import RNDateTimePicker from 'react-native-modal-datetime-picker';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';
import {XSmallText} from '../styled/components/Text';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';

function StoryDateInput({...props}) {
  const [visible, setVisible] = useState(false);
  const [date, onChangeDate] = useState<Date>(
    props.value ? new Date(props.value) : new Date(),
  );
  const showPicker = () => {
    setVisible(true);
  };
  const formatDate = (date: Date) => {
    if (date) {
      const year = date.getFullYear().toString().substring(2);
      const month =
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1;
      const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      return `${year}.${month}.${day}`;
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
      <TouchableOpacity
        onPress={() => {
          void showPicker();
        }}
        style={{
          width: 97,
          height: 14,
          margin: 0,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}>
        <HorizontalContentContainer>
          <MaterialCommunityIcon
            name="calendar"
            size={14}
            direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
            color={'white'}
          />
          <XSmallText color={'white'}> {formatDate(date)}</XSmallText>
        </HorizontalContentContainer>
      </TouchableOpacity>
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

export default StoryDateInput;
