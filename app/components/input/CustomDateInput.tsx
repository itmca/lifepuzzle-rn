import React from 'react';
import styles from './styles';
import {DatePickerInput} from 'react-native-paper-dates';

type Props = {
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

export const CustomDateInput = ({
  label,
  disabled,
  placeholder,
  date,
  onChange,
}: Props): JSX.Element => {
  return (
    <DatePickerInput
      style={styles.dateInput}
      locale="en"
      label={label}
      disabled={disabled}
      placeholder={placeholder}
      value={date}
      onChange={onChange}
      inputMode="start"
      mode="outlined"
    />
  );
};
