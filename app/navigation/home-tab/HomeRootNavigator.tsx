import React from 'react';
import ProfilePage from '../../pages/Profile/ProfilePage';
import HomePage from '../../pages/Home/HomePage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NavigationBar from '../../components/navigation/NavigationBar';

export type HomeTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<HomeTabParamList>();

const HomeTabNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        header: () => <NavigationBar />,
      }}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
    </Stack.Navigator>
  );
};

export default HomeTabNavigator;
