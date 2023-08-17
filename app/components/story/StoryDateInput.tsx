import {TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {XSmallText} from '../styled/components/Text';
import {HorizontalContentContainer} from '../styled/container/ContentContainer';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Color} from '../../constants/color.constant';
import {XSmallImage} from '../styled/components/Image';

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
          backgroundColor: props.backgroundColor ?? 'transparent',
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 5,
        }}>
        <HorizontalContentContainer gap={'4px'} alignItems={'center'}>
          <XSmallImage
            tintColor={props.color ?? Color.WHITE}
            source={require('../../assets/images/calendar_month.png')}
          />
          <XSmallText color={props.color ?? Color.WHITE}>
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
        cancelTextIOS={'취소'}
      />
    </>
  );
}

export default StoryDateInput;
