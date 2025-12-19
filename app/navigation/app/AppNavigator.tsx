import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import { HomePage } from '../../pages/Home/HomePage';
import { MainTopBar } from '../../components/ui/navigation/TopBar';
import { StoryViewNavigator, StoryViewParamList } from './StoryViewNavigator';
import { AiPhotoNavigator, AiPhotoParamList } from './AiPhotoNavigator';
import {
  StoryWritingNavigator,
  StoryWritingParamList,
} from './StoryWritingNavigator';
import {
  HeroSettingNavigator,
  HeroSettingParamList,
} from './HeroSettingNavigator';
import {
  AccountSettingNavigator,
  AccountSettingParamList,
} from './AccountSettingNavigator';
import { APP_SCREENS } from '../screens.constant';

export type AppParamList = {
  [APP_SCREENS.HOME]: undefined;
  [APP_SCREENS.STORY_VIEW_NAVIGATOR]: NavigatorScreenParams<StoryViewParamList>;
  [APP_SCREENS.AI_PHOTO_NAVIGATOR]: NavigatorScreenParams<AiPhotoParamList>;
  [APP_SCREENS.STORY_WRITING_NAVIGATOR]: NavigatorScreenParams<StoryWritingParamList>;
  [APP_SCREENS.HERO_SETTING_NAVIGATOR]: NavigatorScreenParams<HeroSettingParamList>;
  [APP_SCREENS.ACCOUNT_SETTING_NAVIGATOR]: NavigatorScreenParams<AccountSettingParamList>;
};

const Stack = createNativeStackNavigator<AppParamList>();

const AppNavigator = (): React.ReactElement => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={APP_SCREENS.HOME}
    >
      <Stack.Screen
        name={APP_SCREENS.HOME}
        component={HomePage}
        options={{
          header: () => <MainTopBar />,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={APP_SCREENS.STORY_VIEW_NAVIGATOR}
        component={StoryViewNavigator}
      />
      <Stack.Screen
        name={APP_SCREENS.AI_PHOTO_NAVIGATOR}
        component={AiPhotoNavigator}
      />
      <Stack.Screen
        name={APP_SCREENS.STORY_WRITING_NAVIGATOR}
        component={StoryWritingNavigator}
      />
      <Stack.Screen
        name={APP_SCREENS.HERO_SETTING_NAVIGATOR}
        component={HeroSettingNavigator}
      />
      <Stack.Screen
        name={APP_SCREENS.ACCOUNT_SETTING_NAVIGATOR}
        component={AccountSettingNavigator}
      />
    </Stack.Navigator>
  );
};

export { AppNavigator };
