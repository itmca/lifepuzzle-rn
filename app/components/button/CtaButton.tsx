import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {MediumButton} from '../styled/components/Button';
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
    <MediumButton
      disabled={disabled}
      onPress={onPress}
      backgroundColor={backgroundColor}>
      <Text style={styles.coloredButtonFont}>{text}</Text>
    </MediumButton>
  );
};

export default CtaButton;
