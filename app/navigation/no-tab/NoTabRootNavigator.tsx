import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoryWritingNavigator, {
  StoryWritingParamList,
} from './StoryWritingNavigator';
import LoginRegisterNavigator, {
  LoginRegisterParamList,
} from './LoginRegisterNavigator';
import HeroSettingNavigator, {
  HeroSettingParamList,
} from './HeroSettingNavigator';
import AccountSettingNavigator, {
  AccountSettingParamList,
} from './AccountSettingNavigator';
import StoryViewNavigator, {StoryViewParamList} from './StoryViewNavigator';
import PolicyNavigator, {PolicyParamList} from './PolicyNavigator';
import {NavigatorScreenParams} from '@react-navigation/native';
import AiPhotoNavigator, {AiPhotoParamList} from './AiPhotoNavigator';

export type NoTabParamList = {
  StoryViewNavigator: NavigatorScreenParams<StoryViewParamList>;
  AiPhotoNavigator: NavigatorScreenParams<AiPhotoParamList>;
  StoryWritingNavigator: NavigatorScreenParams<StoryWritingParamList>;
  LoginRegisterNavigator: NavigatorScreenParams<LoginRegisterParamList>;
  HeroSettingNavigator: NavigatorScreenParams<HeroSettingParamList>;
  AccountSettingNavigator: NavigatorScreenParams<AccountSettingParamList>;
  PolicyNavigator: NavigatorScreenParams<PolicyParamList>;
};

const Stack = createNativeStackNavigator<NoTabParamList>();

const NoTabRootNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={
        /* 앱 실행 시 미로그인 되어 있다면 로그인 화면이 노출되어야 해 명시적으로 LoginRegisterNavigator을 초기화면으로 설정한다 */
        'LoginRegisterNavigator'
      }>
      <Stack.Screen
        name="LoginRegisterNavigator"
        component={LoginRegisterNavigator}
      />
      <Stack.Screen name="StoryViewNavigator" component={StoryViewNavigator} />
      <Stack.Screen name="AiPhotoNavigator" component={AiPhotoNavigator} />
      <Stack.Screen
        name="StoryWritingNavigator"
        component={StoryWritingNavigator}
      />
      <Stack.Screen
        name="HeroSettingNavigator"
        component={HeroSettingNavigator}
      />
      <Stack.Screen
        name="AccountSettingNavigator"
        component={AccountSettingNavigator}
      />
      <Stack.Screen name="PolicyNavigator" component={PolicyNavigator} />
    </Stack.Navigator>
  );
};

export default NoTabRootNavigator;
