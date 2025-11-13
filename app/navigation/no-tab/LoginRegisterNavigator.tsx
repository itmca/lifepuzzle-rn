import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginMainPage from '../../pages/AccountPages/LoginMain/LoginMainPage';
import LoginHeaderLeft from '../../components/ui/navigation/header/LoginHeaderLeft';
import LoginOthersPage from '../../pages/AccountPages/LoginOthers/LoginOthersPage';
import RegisterPage from '../../pages/AccountPages/Register/RegisterPage';
import {Color} from '../../constants/color.constant';
import {TopBar} from '../../components/ui/navigation/TopBar';

export type LoginRegisterParamList = {
  LoginMain: undefined;
  LoginOthers: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<LoginRegisterParamList>();

const LoginRegisterNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}
      initialRouteName={'LoginMain'}>
      <Stack.Screen
        name="LoginMain"
        component={LoginMainPage}
        options={{
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
            <LoginHeaderLeft type={'sub'} iconColor={Color.GREY_900} />
          ),
          headerShown: true,
          title: '',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterPage}
        options={{
          header: () => <TopBar title={'회원가입'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginRegisterNavigator;
