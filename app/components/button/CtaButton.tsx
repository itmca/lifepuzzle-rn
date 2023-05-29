import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {MediumButton} from '../styled/components/Button';
import styles from './styles';

type Props = {
  onPress: () => void;
  color?: string;
  text: string;
  style?: any;
  disabled?: boolean;
  marginTop?: string;
  marginBottom?: string;
};

const CtaButton = ({
  onPress,
  color,
  text,
  marginTop,
  disabled = false,
}: Props): JSX.Element => {
  const backgroundColor = color ? color : '#343666';
  return (
    <MediumButton
      marginTop={marginTop}
      disabled={disabled}
      onPress={onPress}
      backgroundColor={backgroundColor}>
      <Text style={styles.coloredButtonFont}>{text}</Text>
    </MediumButton>
  );
};

export default CtaButton;
