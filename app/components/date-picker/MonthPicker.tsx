import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {styles} from './styles';
import {NumberInput} from '../input/NumberInput';

type Props = {
  initialDate: Date;
  onChange: (date: Date) => void;
};

export const MonthPicker = ({initialDate, onChange}: Props): JSX.Element => {
  const [year, setYear] = useState<number>(initialDate.getFullYear());
  const [month, setMonth] = useState<number>(initialDate.getMonth() + 1);

  useEffect(() => {
    if (!year || !month) {
      return;
    }

    const date = new Date(year, month, 0);

    onChange(date);
  }, [year, month]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>그 때는 </Text>
      <NumberInput
        customStyle={styles.numberInput}
        initialNumber={year}
        onChangeNumber={newYear => {
          setYear(newYear);
        }}
        autoFocus={true}
      />
      <Text style={styles.text}> 년 </Text>
      <NumberInput
        customStyle={styles.numberInput}
        initialNumber={month}
        onChangeNumber={newMonth => {
          setMonth(newMonth);
        }}
        rangeStart={1}
        rangeEnd={12}
        onOutOfRange={() => {
          Alert.alert('1부터 12사이의 숫자를 입력 해 주세요.');
        }}
      />
      <Text style={styles.text}> 월 </Text>
    </View>
  );
};
