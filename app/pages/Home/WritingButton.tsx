import React from 'react';

import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '../../recoils/auth.recoil';
import {LargeText} from '../../components/styled/components/Text';
import {Color} from '../../constants/color.constant';

type Props = {
  heroName: string;
  puzzleCount: number;
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
          height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});

export const WritingButton = ({
  onPress,
  puzzleCount,
  heroName,
}: Props): JSX.Element => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const displayHeroName =
    heroName.length > 8 ? `${heroName.substring(0, 8)}...` : heroName;

  return (
    <TouchableOpacity onPress={onPress} style={styles.writingButton}>
      <LargeText color={Color.WHITE}>
        {isLoggedIn
          ? `${displayHeroName}의 ${puzzleCount + 1}번째 이야기 작성하기`
          : '이야기 작성 체험하기'}
      </LargeText>
    </TouchableOpacity>
  );
};
