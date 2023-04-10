import React from 'react';

import {TouchableOpacity} from 'react-native';
import {styles} from '../../pages/StoryList/styles';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  visible: boolean;
  onPress: () => void;
};

export const GoToTopButton = ({visible, onPress}: Props): JSX.Element => {
  if (!visible) {
    return <></>;
  }

  return (
    <TouchableOpacity style={styles.floatingBtBox} onPress={onPress}>
      <Icon
        name="chevron-up-sharp"
        size={34}
        color={'#000000'}
        style={styles.floatingBtTop}
      />
    </TouchableOpacity>
  );
};
