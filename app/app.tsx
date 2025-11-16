/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';

// Import global Recoil polyfill for remaining legacy code
import './lib/global-recoil-polyfill';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {AppState} from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import {useFetchLocalStorageUserHero} from './service/core/local-storage.hook';
import {LocalStorage} from './service/core/local-storage.service';
import {useAuthStore} from './stores/auth.store';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {hideSplash, showSplash} from 'react-native-splash-view';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useLinking} from './service/device/linking.hook.ts';
import {ToastComponent} from './components/ui/feedback/Toast.tsx';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import ShareModule from '../src/NativeLPShareModule';
import {useShareStore} from './stores/share.store';
import {BasicNavigationProps} from './navigation/types.tsx';

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

const InternalApp = (): React.JSX.Element => {
  useFetchLocalStorageUserHero();
  const navigation = useNavigation<BasicNavigationProps>();
  const {setSharedImageData} = useShareStore();

  const checkSharedData = () => {
    if (ShareModule?.getSharedData) {
      ShareModule.getSharedData()
        .then(data => {
          if (data && data.type) {
            setSharedImageData(data);
            navigation.navigate('HomeTab', {screen: 'Home'});
          }
        })
        .catch(() => {});
    }
  };

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
  }, [setSharedImageData]);

  return (
    <PaperProvider theme={theme}>
      <ActionSheetProvider>
        <RootNavigator />
      </ActionSheetProvider>
    </PaperProvider>
  );
};

const App = (): React.JSX.Element => {
  useEffect(() => {
    showSplash();

    // Initialize Zustand stores
    initializeZustandState();

    setTimeout(() => {
      hideSplash(); // Hide after some time
    }, 2000);
  }, []);

  const linking = useLinking();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer linking={linking}>
        <InternalApp />
        <ToastComponent />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
