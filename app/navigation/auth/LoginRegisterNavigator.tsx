import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginMainPage } from '../../pages/AccountPages/LoginMain/LoginMainPage';
import { LoginOthersPage } from '../../pages/AccountPages/LoginOthers/LoginOthersPage';
import { RegisterPage } from '../../pages/AccountPages/Register/RegisterPage';
import { TopBar } from '../../components/ui/navigation/TopBar';
import { LOGIN_REGISTER_SCREENS } from '../screens.constant';

export type LoginRegisterParamList = {
  [LOGIN_REGISTER_SCREENS.LOGIN_MAIN]: undefined;
  [LOGIN_REGISTER_SCREENS.LOGIN_OTHERS]: undefined;
  [LOGIN_REGISTER_SCREENS.REGISTER]: undefined;
};

const Stack = createNativeStackNavigator<LoginRegisterParamList>();

const LoginRegisterNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShadowVisible: false, headerTitleAlign: 'center' }}
      initialRouteName={LOGIN_REGISTER_SCREENS.LOGIN_MAIN}
    >
      <Stack.Screen
        name={LOGIN_REGISTER_SCREENS.LOGIN_MAIN}
        component={LoginMainPage}
        options={{
          header: () => <TopBar title={''} />,
        }}
      />
      <Stack.Screen
        name={LOGIN_REGISTER_SCREENS.LOGIN_OTHERS}
        component={LoginOthersPage}
        options={{
          header: () => <TopBar title={''} />,
        }}
      />
      <Stack.Screen
        name={LOGIN_REGISTER_SCREENS.REGISTER}
        component={RegisterPage}
        options={{
          header: () => <TopBar title={'회원가입'} />,
        }}
      />
    </Stack.Navigator>
  );
};

export { LoginRegisterNavigator };
