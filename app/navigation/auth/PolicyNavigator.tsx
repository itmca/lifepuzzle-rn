import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicePolicyPage } from '../../pages/PolicyPages/ServicePolicy/ServicePolicyPage';
import { PrivacyPolicyPage } from '../../pages/PolicyPages/PrivacyPolicy/PrivacyPolicyPage';

export type PolicyParamList = {
  ServicePolicy: { settingAgree: (checked: boolean) => void };
  PrivacyPolicy: { settingAgree: (checked: boolean) => void };
};

const Stack = createNativeStackNavigator<PolicyParamList>();

const PolicyNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      initialRouteName="ServicePolicy"
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
      }}
    >
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
