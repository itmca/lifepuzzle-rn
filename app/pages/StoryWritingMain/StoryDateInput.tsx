import {TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {XSmallText} from '../../components/styled/components/LegacyText.tsx';
import {ContentContainer} from '../../components/styled/container/ContentContainer';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {LegacyColor} from '../../constants/color.constant';
import {XSmallImage} from '../../components/styled/components/Image';

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
      const year = date.getFullYear();
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

  useEffect(() => {
    if (!props.value) {
      return;
    }

    onChangeDate(new Date(props.value));
  }, [props.value]);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          void showPicker();
        }}
        disabled={props.disabled}
        style={{
          backgroundColor: LegacyColor.SECONDARY_LIGHT,
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 5,
          width: 97,
        }}>
        <ContentContainer
          gap={4}
          alignItems={'center'}
          useHorizontalLayout
          withNoBackground>
          <XSmallImage
            tintColor={LegacyColor.PRIMARY_MEDIUM}
            source={require('../../assets/images/calendar_month.png')}
          />
          <XSmallText color={LegacyColor.PRIMARY_MEDIUM}>
            {formatDate(date)}
          </XSmallText>
        </ContentContainer>
      </TouchableOpacity>
      <DateTimePicker
        isVisible={visible}
        date={date}
        minimumDate={props.startDate}
        maximumDate={props.endDate}
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
