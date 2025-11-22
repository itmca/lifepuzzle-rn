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
import { useFetchLocalStorageUserHero } from './service/core/local-storage.hook';
import { LocalStorage } from './service/core/local-storage.service';
import { useAuthStore } from './stores/auth.store';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { hideSplash, showSplash } from 'react-native-splash-view';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLinking } from './service/device/linking.hook.ts';
import { ToastComponent } from './components/ui/feedback/Toast.tsx';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import ShareModule from '../src/NativeLPShareModule';
import { useShareStore } from './stores/share.store';
import { BasicNavigationProps } from './navigation/types.tsx';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#343666',
    accent: 'yellow',
    background: '#ffffff',
  },
};

function initializeZustandState(): void {
  const authToken = LocalStorage.get('authToken', 'json');
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
    showSplash();

    // Initialize Zustand stores
    initializeZustandState();

    setTimeout(() => {
      hideSplash(); // Hide after some time
    }, 2000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        <InternalApp />
        <ToastComponent />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
