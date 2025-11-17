import * as React from 'react';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTabNavigator, {
  HomeTabParamList,
} from './home-tab/HomeRootNavigator';
import NoTabRootNavigator, {
  NoTabParamList,
} from './no-tab/NoTabRootNavigator';
import { NavigatorScreenParams } from '@react-navigation/native';
import OnboardingPage from '../pages/Onboarding/OnboardingPage.tsx';
import { LocalStorage } from '../service/core/local-storage.service';
import { useAuthStore } from '../stores/auth.store';

export type RootStackParamList = {
  Onboarding: undefined;
  HomeTab: NavigatorScreenParams<HomeTabParamList>;
  NoTab: NavigatorScreenParams<NoTabParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = (): React.ReactElement => {
  // React hooks
  const [initialRoute, setInitialRoute] = useState<
    keyof RootStackParamList | null
  >(null);

  // 글로벌 상태 관리 (Zustand)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn());

  // Side effects
  useEffect(() => {
    const checkOnboarding = async () => {
      const isOnboardingNotCompleted =
        LocalStorage.get('onboarding', 'boolean') !== true;

      if (isOnboardingNotCompleted) {
        setInitialRoute('Onboarding');
        return;
      }

      // 미로그인 시에는 홈화면이 아니라 로그인 화면이 노출되도록 NoTab을 초기화면으로 설정한다.
      setInitialRoute(isLoggedIn ? 'HomeTab' : 'NoTab');
    };

    checkOnboarding();
  }, []);

  if (!initialRoute) {
    return <></>;
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="Onboarding" component={OnboardingPage} />
      <Stack.Screen name="HomeTab" component={HomeTabNavigator} />
      <Stack.Screen name="NoTab" component={NoTabRootNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
