import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import {
  LoginRegisterNavigator,
  LoginRegisterParamList,
} from './LoginRegisterNavigator';
import { PolicyNavigator, PolicyParamList } from './PolicyNavigator';
import { AUTH_SCREENS } from '../screens.constant';

export type AuthParamList = {
  [AUTH_SCREENS.LOGIN_REGISTER_NAVIGATOR]: NavigatorScreenParams<LoginRegisterParamList>;
  [AUTH_SCREENS.POLICY_NAVIGATOR]: NavigatorScreenParams<PolicyParamList>;
};

const Stack = createNativeStackNavigator<AuthParamList>();

const AuthNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={AUTH_SCREENS.LOGIN_REGISTER_NAVIGATOR}
    >
      <Stack.Screen
        name={AUTH_SCREENS.LOGIN_REGISTER_NAVIGATOR}
        component={LoginRegisterNavigator}
      />
      <Stack.Screen
        name={AUTH_SCREENS.POLICY_NAVIGATOR}
        component={PolicyNavigator}
      />
    </Stack.Navigator>
  );
};

export { AuthNavigator };
