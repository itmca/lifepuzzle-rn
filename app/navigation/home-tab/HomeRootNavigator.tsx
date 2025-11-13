import React from 'react';
import HomePage from '../../pages/Home/HomePage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTopBar} from '../../components/ui/navigation/TopBar';

export type HomeTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<HomeTabParamList>();

const HomeTabNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          header: () => <MainTopBar />,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeTabNavigator;
