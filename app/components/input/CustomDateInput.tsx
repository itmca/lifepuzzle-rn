import React from 'react';
import styles from './styles';
import DateInput from '../styled/components/DateInput';

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
    <DateInput
      label={label}
      disabled={disabled}
      placeholder={placeholder}
      value={date}
      onChange={onChange}
    />
  );
};
