import React from 'react';

import {TouchableOpacity} from 'react-native';
import {styles} from '../../pages/StoryList/styles';
import {MediumText} from '../styled/components/Text';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';

type Props = {
  onPress: () => void;
};

export const WritingButton = ({onPress}: Props): JSX.Element => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  return (
    <TouchableOpacity onPress={onPress} style={styles.writingButton}>
      <MediumText color={isLoggedIn ? '#FF6200' : '#000000'} fontWeight={600}>
        {isLoggedIn ? '글작성하기' : '글작성 체험하기'}
      </MediumText>
    </TouchableOpacity>
  );
};
