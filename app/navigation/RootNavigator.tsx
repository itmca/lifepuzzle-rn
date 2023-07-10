import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeTabParamList} from './home-tab/HomeRootNavigator';
import NoTabRootNavigator, {NoTabParamList} from './no-tab/NoTabRootNavigator';
import {NavigatorScreenParams} from '@react-navigation/native';
import NavigationBar from '../components/navigation/NavigationBar';
import HomeTabNavigator from './home-tab/HomeRootNavigator';

export type RootStackParamList = {
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  NoTab: NavigatorScreenParams<NoTabParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeTab" component={HomeTabNavigator} />
      <Stack.Screen name="NoTab" component={NoTabRootNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
