import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import HomePage from '../../pages/Home/HomePage';
import { MainTopBar } from '../../components/ui/navigation/TopBar';
import StoryViewNavigator, { StoryViewParamList } from './StoryViewNavigator';
import AiPhotoNavigator, { AiPhotoParamList } from './AiPhotoNavigator';
import StoryWritingNavigator, {
  StoryWritingParamList,
} from './StoryWritingNavigator';
import HeroSettingNavigator, {
  HeroSettingParamList,
} from './HeroSettingNavigator';
import AccountSettingNavigator, {
  AccountSettingParamList,
} from './AccountSettingNavigator';

export type AppParamList = {
  Home: undefined;
  StoryViewNavigator: NavigatorScreenParams<StoryViewParamList>;
  AiPhotoNavigator: NavigatorScreenParams<AiPhotoParamList>;
  StoryWritingNavigator: NavigatorScreenParams<StoryWritingParamList>;
  HeroSettingNavigator: NavigatorScreenParams<HeroSettingParamList>;
  AccountSettingNavigator: NavigatorScreenParams<AccountSettingParamList>;
};

const Stack = createNativeStackNavigator<AppParamList>();

const AppNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          header: () => <MainTopBar />,
          headerShown: true,
        }}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
