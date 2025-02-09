import React from 'react';

import {StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {LegacyColor} from '../../constants/color.constant';

type Props = {
  visible: boolean;
  onPress: () => void;
};

const styles = StyleSheet.create({
  floatingBtBox: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: LegacyColor.WHITE,
    position: 'absolute',
    bottom: 95,
    right: 16,
    shadowColor: LegacyColor.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    paddingLeft: 2,
  },
});

export const GoToTopButton = ({visible, onPress}: Props): JSX.Element => {
  if (!visible) {
    return <></>;
  }

  return (
    <TouchableOpacity style={styles.floatingBtBox} onPress={onPress}>
      <Icon name="chevron-up" size={24} color={LegacyColor.BLACK} />
    </TouchableOpacity>
  );
};
