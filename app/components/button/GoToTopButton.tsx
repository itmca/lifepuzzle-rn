import React from 'react';

import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  visible: boolean;
  onPress: () => void;
};

const styles = StyleSheet.create({
  floatingBtBox: {
    width: 48,
    height: 48,
    position: 'absolute',
    backgroundColor: '#FF6200',
    bottom: 95,
    right: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingBtTop: {
    borderRadius: 50,
    color: '#FFFFFF',
  },
});

export const GoToTopButton = ({visible, onPress}: Props): JSX.Element => {
  if (!visible) {
    return <></>;
  }

  return (
    <TouchableOpacity style={styles.floatingBtBox} onPress={onPress}>
      <Icon
        name="chevron-up"
        size={34}
        color={'#000000'}
        style={styles.floatingBtTop}
      />
    </TouchableOpacity>
  );
};
