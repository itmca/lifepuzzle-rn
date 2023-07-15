import {Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {XSmallText} from '../styled/components/Text';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
  const onConfirm = (selectedValue: Date) => {
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
          <Image
            style={{width: 14, height: 14, tintColor: '#FFFFFF'}}
            source={require('../../assets/images/calendar_month.png')}
          />
          <XSmallText style={{color: '#FFFFFF'}}>
            {' '}
            {formatDate(date)}
          </XSmallText>
        </HorizontalContentContainer>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={visible}
        date={date}
        mode={'date'}
        display={'spinner'}
        onConfirm={onConfirm}
        onCancel={onCancel}
        locale="ko"
        confirmTextIOS={'확인'}
        cancelTextIOS={'닫기'}
      />
    </>
  );
}

export default StoryDateInput;
