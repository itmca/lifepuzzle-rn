import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {BasicNavigationProps} from '../../../../navigation/types';
import {Color} from '../../../../constants/color.constant';
import {BasicButton} from '../../../../components/ui/form/Button';

export const HomeLoginButton = (): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();

  return (
    <BasicButton
      backgroundColor={Color.GREY}
      textColor={Color.GREY_800}
      onPress={() => {
        navigation.push('NoTab', {
          screen: 'LoginRegisterNavigator',
          params: {
            screen: 'LoginMain',
          },
        });
      }}
      text={'로그인 하러가기'}
    />
  );
};
