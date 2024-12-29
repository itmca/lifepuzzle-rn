import React from 'react';
import DateInput from '../styled/components/DateInput';

type Props = {
  label?: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  isLunar?: boolean;
  onIsLunarChange?: (isLunar: boolean) => void;
};

export const CustomDateInput = ({
  label,
  date,
  onDateChange,
  isLunar,
  onIsLunarChange,
}: Props): JSX.Element => {
  return (
    <DateInput
      label={label}
      date={date}
      onDateChange={onDateChange}
      isLunar={isLunar}
      onIsLunarChange={onIsLunarChange}
    />
  );
};
