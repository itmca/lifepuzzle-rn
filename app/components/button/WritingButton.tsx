import React from 'react';

import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {MediumText} from '../styled/components/Text';

type Props = {
  onPress: () => void;
};

const styles = StyleSheet.create({
  writingButton: {
    width: '100%',
    height: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: -1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 20,
      },
    }),
  },
});

export const WritingButton = ({onPress}: Props): JSX.Element => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  return (
    <TouchableOpacity onPress={onPress} style={styles.writingButton}>
      <MediumText fontWeight={600} color={isLoggedIn ? '#FF6200' : '#000000'}>
        {isLoggedIn ? '글작성하기' : '글작성 체험하기'}
      </MediumText>
    </TouchableOpacity>
  );
};
