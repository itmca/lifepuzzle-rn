import React from 'react';
import {MediumText} from '../styled/components/Text';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {LargeButton} from '../styled/components/Button';
import {Color} from '../../constants/color.constant';

export const HomeLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    <LargeButton
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'LoginRegisterNavigator',
          params: {
            screen: 'LoginMain',
          },
        });
      }}>
      <MediumText fontWeight={600} color={Color.WHITE}>
        로그인 하러가기
      </MediumText>
    </LargeButton>
  );
};
