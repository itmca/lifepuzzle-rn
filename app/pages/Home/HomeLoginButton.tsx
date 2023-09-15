import React from 'react';
import {MediumText} from '../../components/styled/components/Text';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../navigation/types';
import {LargeButton} from '../../components/styled/components/Button';
import {Color} from '../../constants/color.constant';

export const HomeLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    <LargeButton
      backgroundColor={Color.LIGHT_GRAY}
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'LoginRegisterNavigator',
          params: {
            screen: 'LoginMain',
          },
        });
      }}>
      <MediumText fontWeight={600} color={Color.LIGHT_BLACK}>
        로그인 하러가기
      </MediumText>
    </LargeButton>
  );
  1;
};
