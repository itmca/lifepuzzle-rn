import React, {useEffect, useState} from 'react';
import {Chip} from 'react-native-paper';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {styles} from './styles';

type Props = {
  chips: string[];
  initialSelected?: string;
  onSelect: (selected: string) => void;
  containerStyle?: StyleProp<ViewStyle> | undefined;
};

const SelectableChips = ({
  chips,
  initialSelected,
  onSelect,
  containerStyle,
}: Props): JSX.Element => {
  const [selectedChip, setSelectedChip] = useState<string>(
    initialSelected || chips[0],
  );

  useEffect(() => {
    onSelect(selectedChip);
  }, [selectedChip]);

  return (
    <View style={StyleSheet.compose<ViewStyle>(styles.container, containerStyle)}>
      {chips.map(chip => {
        const selected = chip === selectedChip;
        return (
          <Chip
            key={chip}
            onPress={() => {
              setSelectedChip(chip);
            }}
            style={selected ? styles.selectedChip : styles.unSelectedChip}
            textStyle={
              selected ? styles.selectedChipText : styles.unSelectedChipText
            }>
            {chip}
          </Chip>
        );
      })}
    </View>
  );
};

export default SelectableChips;
