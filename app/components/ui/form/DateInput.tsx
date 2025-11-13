import {TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNDateTimePicker from 'react-native-modal-datetime-picker';
import {ContentContainer} from '../layout/ContentContainer.tsx';
import {BodyTextM} from '../base/TextBase.tsx';
import {Dropdown} from './Dropdown.tsx';
import {SvgIcon} from '../display/SvgIcon.tsx';

type Props = {
  label?: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  isLunar?: boolean;
  onIsLunarChange?: (isLunar: boolean) => void;
};

function DateInput({
  label,
  date: propDate,
  onDateChange,
  isLunar,
  onIsLunarChange,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [date, onChangeDate] = useState<Date>(propDate || new Date());
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
      return `${date.getFullYear()} / ${month} / ${day}`;
    }
  };
  const onDatePick = (selectedValue: Date) => {
    setVisible(false);
    if (selectedValue) {
      const currentDate = selectedValue;
      onDateChange(currentDate);
      onChangeDate(currentDate);
    }
  };
  const onCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!propDate) {
      return;
    }

    onChangeDate(propDate);
  }, [propDate]);

  return (
    <ContentContainer gap={6}>
      {label && (
        <ContentContainer>
          <BodyTextM>{label}</BodyTextM>
        </ContentContainer>
      )}
      <ContentContainer
        useHorizontalLayout
        paddingHorizontal={16}
        height={48}
        withBorder
        borderRadius={6}>
        <ContentContainer
          gap={0}
          useHorizontalLayout
          width={'auto'}
          alignCenter>
          <SvgIcon name={'calendar'} size={24} />
          <Dropdown
            mode={'transparent'}
            options={[
              {label: '양력', value: 'SOLAR'},
              {label: '음력', value: 'LUNAR'},
            ]}
            defaultValue={isLunar ? 'LUNAR' : 'SOLAR'}
            onSelect={selectedItem => {
              if (onIsLunarChange === undefined) {
                return;
              }

              onIsLunarChange(selectedItem.value === 'LUNAR');
            }}
          />
        </ContentContainer>
        <ContentContainer flex={1} expandToEnd>
          <TouchableOpacity onPress={showPicker}>
            <BodyTextM>{formatDate(date)}</BodyTextM>
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
    </ContentContainer>
  );
}

export default DateInput;
