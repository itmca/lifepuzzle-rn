import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {styles} from './styles';
import {NumberInput} from '../input/NumberInput';
import { LargeText } from "../styled/components/Text";

type Props = {
  heroName: string;
  initialAge: number;
  onChangeAge: (age: number) => void;
};
export const AgePicker = ({
  heroName,
  initialAge,
  onChangeAge,
}: Props): JSX.Element => {
  const [age, setAge] = useState<number>(initialAge);

  useEffect(() => {
    onChangeAge(age);
  }, [age]);

  return (
    <View style={styles.container}>
      <LargeText>당시 {heroName}님의 나이 </LargeText>
      <NumberInput
        customStyle={styles.numberInput}
        initialNumber={age}
        onChangeNumber={newAge => {
          setAge(newAge);
        }}
        autoFocus={true}
      />
      <LargeText> 세</LargeText>
    </View>
  );
};
