import * as React from 'react';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import OnboardingPage from '../pages/Onboarding/OnboardingPage.tsx';
import { LocalStorage } from '../services/core/local-storage.service';
import { useAuthStore } from '../stores/auth.store';
import AuthNavigator, { AuthParamList } from './auth/AuthNavigator';
import AppNavigator, { AppParamList } from './app/AppNavigator';
import { ROOT_SCREENS } from './screens.constant';

export type RootStackParamList = {
  [ROOT_SCREENS.ONBOARDING]: undefined;
  [ROOT_SCREENS.AUTH]: NavigatorScreenParams<AuthParamList>;
  [ROOT_SCREENS.APP]: NavigatorScreenParams<AppParamList>;
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
        setInitialRoute(ROOT_SCREENS.ONBOARDING);
        return;
      }

      // 미로그인 시에는 홈화면이 아니라 로그인 화면이 노출되도록 Auth를 초기화면으로 설정한다.
      setInitialRoute(isLoggedIn ? ROOT_SCREENS.APP : ROOT_SCREENS.AUTH);
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
      <Stack.Screen name={ROOT_SCREENS.ONBOARDING} component={OnboardingPage} />
      <Stack.Screen name={ROOT_SCREENS.AUTH} component={AuthNavigator} />
      <Stack.Screen name={ROOT_SCREENS.APP} component={AppNavigator} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
