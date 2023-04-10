import * as React from 'react';
import GoBackHeaderLeft from '../../components/header/GoBackHeaderLeft';
import AccountModificationPage from '../../pages/AccountModification/AccountModificationPage';
import AccountPasswordModificationPage from '../../pages/AccountPasswordModification/AccountPasswordModificationPage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type AccountSettingParamList = {
  AccountModification: undefined;
  AccountPasswordModification: undefined;
};

const Stack = createNativeStackNavigator<AccountSettingParamList>();

const AccountSettingNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="AccountModification"
      screenOptions={{headerShadowVisible: false, headerTitleAlign: 'center'}}>
      <Stack.Screen
        name="AccountModification"
        component={AccountModificationPage}
        options={{
          headerLeft: () => <GoBackHeaderLeft />,
          title: '계정 정보 수정',
        }}
      />
      <Stack.Screen
        name="AccountPasswordModification"
        component={AccountPasswordModificationPage}
        options={{
          headerLeft: () => <GoBackHeaderLeft />,
          title: '비밀번호 수정',
        }}
      />
    </Stack.Navigator>
  );
};

export default AccountSettingNavigator;
