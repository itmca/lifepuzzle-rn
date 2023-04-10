import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ServicePolicyPage} from '../../pages/ServicePolicy/ServicePolicyPage';
import {PrivacyPolicyPage} from '../../pages/PrivacyPolicy/PrivacyPolicyPage';

export type PolicyParamList = {
  ServicePolicy: {settingAgree: (checked: boolean) => void};
  PrivacyPolicy: {settingAgree: (checked: boolean) => void};
};

const Stack = createNativeStackNavigator<PolicyParamList>();

const PolicyNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="ServicePolicy"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="ServicePolicy"
        component={ServicePolicyPage}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyPage}
        options={{
          title: '',
        }}
      />
    </Stack.Navigator>
  );
};

export default PolicyNavigator;
