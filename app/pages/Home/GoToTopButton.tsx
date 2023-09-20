import React from 'react';

import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {Color} from '../../constants/color.constant';

type Props = {
  visible: boolean;
  onPress: () => void;
};

const styles = StyleSheet.create({
  floatingBtBox: {
    position: 'absolute',
    bottom: 95,
    right: 16,
    shadowColor: Color.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export const GoToTopButton = ({visible, onPress}: Props): JSX.Element => {
  if (!visible) {
    return <></>;
  }

  return (
    <TouchableOpacity style={styles.floatingBtBox} onPress={onPress}>
      <Icon name="upcircle" size={35} color={'#FF6200'} />
    </TouchableOpacity>
  );
};
