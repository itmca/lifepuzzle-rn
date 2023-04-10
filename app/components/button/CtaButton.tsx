import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';

type Props = {
  onPress: () => void;
  color?: 'primary';
  text: string;
  style?: any;
  disabled?: boolean;
};

const CtaButton = ({
  onPress,
  color = 'primary',
  text,
  style,
  disabled = false,
}: Props): JSX.Element => {
  const backgroundColor = color === 'primary' ? '#343666' : '#A3A7F8';
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{
        ...styles.coloredButtonContainer,
        backgroundColor,
        ...style,
        ...(disabled ? {backgroundColor: 'grey'} : {}),
      }}>
      <Text style={styles.coloredButtonFont}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CtaButton;
