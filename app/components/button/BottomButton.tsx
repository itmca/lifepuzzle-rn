import React from 'react';

import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { LargeText } from '../styled/components/Text';
import { Color } from '../../constants/color.constant';

type Props = {
  onPress: () => void;
  disabled: boolean;
  title: string;
};

export const BottomButton = (props: Props): JSX.Element => {

  const styles = StyleSheet.create({
    button: {
      width: '100%',
      height: 80,
      backgroundColor: props.disabled ? Color.LIGHT_GRAY : Color.PRIMARY_LIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 0,
      ...Platform.select({
        ios: {
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: props.disabled ? 0: 0.1,
          shadowRadius: 5,
        },
        android: {
          elevation: 20,
        },
      }),
    },
  });
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={styles.button}
      disabled={props.disabled}>
      <LargeText fontWeight={600} color={props.disabled ? Color.MEDIUM_GRAY : Color.WHITE}>
        {props.title}
      </LargeText>
    </TouchableOpacity>
  );
};
