import React, {useEffect, useState} from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Color} from '../../../constants/color.constant';
import {Caption} from '../../../components/styled/components/Text.tsx';
import {SvgIcon} from '../../../components/styled/components/SvgIcon.tsx';
import {ButtonBase} from '../../../components/styled/components/Button.tsx';

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];
function StoryDateInput({...props}) {
  const [visible, setVisible] = useState(false);
  const [date, onChangeDate] = useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined,
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
      const dd = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      const day = daysKor[date.getDay()];
      return `${year}.${month}.${dd} (${day})`;
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
      <ButtonBase
        height={'24px'}
        width={'auto'}
        backgroundColor={Color.TRANSPARENT}
        disabled={props.disabled}
        onPress={() => {
          void showPicker();
        }}
        borderInside>
        <SvgIcon name={'calendar'} size={24} />
        {date ? (
          <Caption color={Color.GREY_600}>{formatDate(date)}</Caption>
        ) : (
          <Caption color={Color.GREY_400}>날짜를 선택해 주세요</Caption>
        )}
      </ButtonBase>
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
