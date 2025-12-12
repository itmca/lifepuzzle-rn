/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { AppState } from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import { useFetchLocalStorageUserHero } from './services/core/app-initializer.hook';
import { SecureStorage } from './services/core/secure-storage.service';
import { useAuthStore } from './stores/auth.store';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { hideSplash, showSplash } from 'react-native-splash-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLinking } from './services/device/linking.hook.ts';
import { ToastComponent } from './components/ui/feedback/Toast.tsx';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import ShareModule from '../src/NativeLPShareModule';
import { useShareStore } from './stores/share.store';
import { BasicNavigationProps } from './navigation/types.tsx';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { focusManager, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './services/core/query-client.ts';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#343666',
    accent: 'yellow',
    background: '#ffffff',
  },
};

async function initializeZustandState(): Promise<void> {
  const authToken = await SecureStorage.getAuthTokens();
  if (authToken) {
    useAuthStore.getState().setAuthTokens(authToken);
  }
}

const InternalApp = (): React.ReactElement => {
  // 글로벌 상태 관리 (Zustand)
  const { setSharedImageData } = useShareStore();

  // 외부 hook 호출 (navigation, route 등)
  const navigation = useNavigation<BasicNavigationProps>();

  // Custom hooks
  useFetchLocalStorageUserHero();

  // Custom functions
  const checkSharedData = () => {
    if (ShareModule?.getSharedData) {
      ShareModule.getSharedData()
        .then(data => {
          if (data && data.type) {
            setSharedImageData(data);
            navigation.navigate('App', { screen: 'Home' });
          }
        })
        .catch(() => {});
    }
  };

  // Side effects
  useEffect(() => {
    checkSharedData();

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        checkSharedData();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription?.remove();
  }, [checkSharedData, setSharedImageData]);

  return (
    <PaperProvider theme={theme}>
      <ActionSheetProvider>
        <RootNavigator />
      </ActionSheetProvider>
    </PaperProvider>
  );
};

const App = (): React.ReactElement => {
  // Custom hooks
  const linking = useLinking();

  // Side effects
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      focusManager.setFocused(state === 'active');
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const initialize = async () => {
      showSplash();

      // Initialize Zustand stores from secure storage
      await initializeZustandState();

      setTimeout(() => {
        hideSplash(); // Hide after some time
      }, 2000);
    };

    initialize();
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer linking={linking}>
              <InternalApp />
              <ToastComponent />
            </NavigationContainer>
          </QueryClientProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;
