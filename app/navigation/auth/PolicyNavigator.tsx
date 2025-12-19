import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ServicePolicyPage } from '../../pages/PolicyPages/ServicePolicy/ServicePolicyPage';
import { PrivacyPolicyPage } from '../../pages/PolicyPages/PrivacyPolicy/PrivacyPolicyPage';
import { POLICY_SCREENS } from '../screens.constant';

export type PolicyParamList = {
  [POLICY_SCREENS.SERVICE_POLICY]: { settingAgree: (checked: boolean) => void };
  [POLICY_SCREENS.PRIVACY_POLICY]: { settingAgree: (checked: boolean) => void };
};

const Stack = createNativeStackNavigator<PolicyParamList>();

const PolicyNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      initialRouteName={POLICY_SCREENS.SERVICE_POLICY}
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name={POLICY_SCREENS.SERVICE_POLICY}
        component={ServicePolicyPage}
        options={{
          title: '',
        }}
      />
      <Stack.Screen
        name={POLICY_SCREENS.PRIVACY_POLICY}
        component={PrivacyPolicyPage}
        options={{
          title: '',
        }}
      />
    </Stack.Navigator>
  );
};

export { PolicyNavigator };
