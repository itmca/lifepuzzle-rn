import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PuzzleWritingNavigator, {PuzzleWritingParamList} from './PuzzleWritingNavigator';
import LoginRegisterNavigator, {LoginRegisterParamList} from './LoginRegisterNavigator';
import HeroSettingNavigator, {HeroSettingParamList} from './HeroSettingNavigator';
import AccountSettingNavigator, {AccountSettingParamList} from './AccountSettingNavigator';
import StoryViewNavigator, {StoryViewParamList} from './StoryViewNavigator';
import PolicyNavigator, {PolicyParamList} from './PolicyNavigator';
import {NavigatorScreenParams} from "@react-navigation/native";

export type NoTabParamList = {
  StoryViewNavigator: NavigatorScreenParams<StoryViewParamList>;
  PuzzleWritingNavigator: NavigatorScreenParams<PuzzleWritingParamList>;
  LoginRegisterNavigator: NavigatorScreenParams<LoginRegisterParamList>;
  HeroSettingNavigator: NavigatorScreenParams<HeroSettingParamList>;
  AccountSettingNavigator: NavigatorScreenParams<AccountSettingParamList>;
  PolicyNavigator: NavigatorScreenParams<PolicyParamList>;
};

const Stack = createNativeStackNavigator<NoTabParamList>();

const NoTabRootNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StoryViewNavigator" component={StoryViewNavigator} />
      <Stack.Screen
        name="PuzzleWritingNavigator"
        component={PuzzleWritingNavigator}
      />
      <Stack.Screen
        name="LoginRegisterNavigator"
        component={LoginRegisterNavigator}
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
