import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {styles} from './styles';
import {NumberInput} from '../input/NumberInput';

type Props = {
  heroName: string;
  initialAge: number;
  onChangeAgeGroup: (ageGroup: number) => void;
};

export const AgeGroupPicker = ({
  heroName,
  initialAge,
  onChangeAgeGroup,
}: Props): JSX.Element => {
  const [ageGroup, setAgeGroup] = useState<number>(Math.floor(initialAge / 10));

  useEffect(() => {
    onChangeAgeGroup(ageGroup * 10);
  }, [ageGroup]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>당시 {heroName}님은 </Text>
      <NumberInput
        customStyle={styles.numberInput}
        initialNumber={ageGroup}
        onChangeNumber={newAge => {
          setAgeGroup(newAge);
        }}
        autoFocus={true}
        rangeStart={1}
        rangeEnd={9}
        onOutOfRange={() => {
          Alert.alert('1부터 9까지 입력할 수 있습니다.');
        }}
      />
      <Text style={styles.numberInput}>0</Text>
      <Text style={styles.text}> 대</Text>
    </View>
  );
};
