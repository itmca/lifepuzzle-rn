import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeTabRootNavigator, {
  HomeTabParamList,
} from './home-tab/HomeTabRootNavigator';
import NoTabRootNavigator, {NoTabParamList} from './no-tab/NoTabRootNavigator';
import {NavigatorScreenParams} from '@react-navigation/native';

export type RootStackParamList = {
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  NoTab: NavigatorScreenParams<NoTabParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="HomeTab"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeTab" component={HomeTabRootNavigator} />
      <Stack.Screen name="NoTab" component={NoTabRootNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
