import React from 'react';
import { Color } from '../../../constants/color.constant';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../navigation/types';
import { BodyTextB } from '../../ui/base/TextBase';
import { TouchableOpacity } from 'react-native';

const RegisterButton = (): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Auth', {
            screen: 'LoginRegisterNavigator',
            params: {
              screen: 'Register',
            },
          });
        }}
      >
        <BodyTextB color={Color.GREY_800} underline>
          회원가입
        </BodyTextB>
      </TouchableOpacity>
    </>
  );
};

export default RegisterButton;
