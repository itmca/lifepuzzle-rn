import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginMainPage from '../../pages/LoginMain/LoginMainPage';
import LoginHeaderLeft from '../../components/header/LoginHeaderLeft';
import LoginOthersPage from '../../pages/LoginOthers/LoginOthersPage';
import RegisterPage from '../../pages/Register/RegisterPage';
import {LegacyColor} from '../../constants/color.constant';
import {LargeTitle} from '../../components/styled/components/Title';
import {View} from 'react-native';

export type LoginRegisterParamList = {
  LoginMain: undefined;
  LoginOthers: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<LoginRegisterParamList>();

const LoginRegisterNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="LoginMain"
        component={LoginMainPage}
        options={{
          headerLeft: () => <LoginHeaderLeft type={'main'} />,
          headerShown: true,
          title: '',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="LoginOthers"
        component={LoginOthersPage}
        options={{
          headerLeft: () => (
            <LoginHeaderLeft type={'sub'} iconColor={LegacyColor.LIGHT_GRAY} />
          ),
          headerShown: true,
          title: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: LegacyColor.PRIMARY_LIGHT,
          },
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{
          headerLeft: () => <LoginHeaderLeft type={'sub'} />,
          headerTitle: () => <LargeTitle>회원가입</LargeTitle>,
          headerShown: true,
          title: '',
          headerShadowVisible: false,
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginRegisterNavigator;
