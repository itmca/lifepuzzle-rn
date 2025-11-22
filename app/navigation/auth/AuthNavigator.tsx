import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import LoginRegisterNavigator, {
  LoginRegisterParamList,
} from './LoginRegisterNavigator';
import PolicyNavigator, { PolicyParamList } from './PolicyNavigator';

export type AuthParamList = {
  LoginRegisterNavigator: NavigatorScreenParams<LoginRegisterParamList>;
  PolicyNavigator: NavigatorScreenParams<PolicyParamList>;
};

const Stack = createNativeStackNavigator<AuthParamList>();

const AuthNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LoginRegisterNavigator"
    >
      <Stack.Screen
        name="LoginRegisterNavigator"
        component={LoginRegisterNavigator}
      />
      <Stack.Screen name="PolicyNavigator" component={PolicyNavigator} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
