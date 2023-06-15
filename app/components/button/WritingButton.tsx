import React from 'react';

import {TouchableOpacity} from 'react-native';
import {styles} from '../../pages/StoryList/styles';
import Icon from 'react-native-vector-icons/Ionicons';
import Text, {MediumText} from '../styled/components/Text';

type Props = {
  onPress: () => void;
};

export const WritingButton = ({onPress}: Props): JSX.Element => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.writingButton}>
      <MediumText color="#FF6200" fontWeight={600}>
        글작성하기
      </MediumText>
    </TouchableOpacity>
  );
};
