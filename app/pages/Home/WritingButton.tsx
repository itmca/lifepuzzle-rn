import React from 'react';

import {Platform, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {LargeText} from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';

type Props = {
  onPress: () => void;
};

const styles = StyleSheet.create({
  writingButton: {
    width: '100%',
    height: 64,
    borderRadius: 16,
    backgroundColor: Color.PRIMARY_LIGHT,
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
      <LargeText fontWeight={600} color={Color.WHITE}>
        {isLoggedIn ? '글작성하기' : '글작성 체험하기'}
      </LargeText>
    </TouchableOpacity>
  );
};
