import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeTabParamList} from './home-tab/HomeRootNavigator';
import NoTabRootNavigator, {NoTabParamList} from './no-tab/NoTabRootNavigator';
import {NavigatorScreenParams} from '@react-navigation/native';
import HomeTabNavigator from './home-tab/HomeRootNavigator';
import {LocalStorage} from '../service/local-storage.service';
import {useEffect, useState} from 'react';
import OnboardingScreen from '../pages/Home/OnboardingScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  NoTab: NavigatorScreenParams<NoTabParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = (): JSX.Element => {
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const isOnboardingCompleted = await LocalStorage.get(
        'onboarding',
        'boolean',
      );
      setInitialRoute(
        isOnboardingCompleted === true ? 'HomeTab' : 'Onboarding',
      );
    };
    checkOnboarding();
  }, []);
  if (!initialRoute) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {initialRoute === 'Onboarding' && (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      )}
      <Stack.Screen name="HomeTab" component={HomeTabNavigator} />
      <Stack.Screen name="NoTab" component={NoTabRootNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
