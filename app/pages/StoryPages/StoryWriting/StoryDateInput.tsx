import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Color } from '../../../constants/color.constant.ts';
import { BodyTextM } from '../../../components/ui/base/TextBase';
import { ButtonBase } from '../../../components/ui/base/ButtonBase';
import Icon from '@react-native-vector-icons/material-icons';

const daysKor = ['일', '월', '화', '수', '목', '금', '토'];

export interface StoryDateInputProps {
  ageGroupLabel: string;
  date?: Date;
  rangeStartDate?: Date;
  rangeEndDate?: Date;
  disabled?: boolean;
  onChange: (date: Date) => void;
}

function StoryDateInput(props: StoryDateInputProps) {
  const [visible, setVisible] = useState(false);
  const [date, onChangeDate] = useState<Date | undefined>(props.date);
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

    return '';
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
    if (!props.date) {
      return;
    }

    onChangeDate(new Date(props.date));
  }, [props.date]);

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
        borderInside
        gap={2}
      >
        {date ? (
          <BodyTextM
            color={Color.GREY_600}
          >{`${props.ageGroupLabel} · ${formatDate(date)}`}</BodyTextM>
        ) : (
          <BodyTextM color={Color.GREY_600}>{props.ageGroupLabel}</BodyTextM>
        )}
        <Icon name={'keyboard-arrow-down'} size={20} color={Color.GREY_400} />
      </ButtonBase>
      <DateTimePicker
        isVisible={visible}
        date={date}
        minimumDate={props.rangeStartDate}
        maximumDate={props.rangeEndDate}
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
