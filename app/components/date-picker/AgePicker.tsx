import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {styles} from './styles';
import {NumberInput} from '../input/NumberInput';

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
      <Text style={styles.text}>당시 {heroName}님의 나이 </Text>
      <NumberInput
        customStyle={styles.numberInput}
        initialNumber={age}
        onChangeNumber={newAge => {
          setAge(newAge);
        }}
        autoFocus={true}
      />
      <Text style={styles.text}> 세</Text>
    </View>
  );
};
