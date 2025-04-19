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
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './navigation/RootNavigator';
import {useFetchLocalStorageUserHero} from './service/hooks/local-storage.hook';
import {MutableSnapshot, RecoilRoot} from 'recoil';
import {LocalStorage} from './service/local-storage.service';
import {authState} from './recoils/auth.recoil';
import {NavigationContainer} from '@react-navigation/native';
import {hideSplash} from 'react-native-splash-view';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import {useLinking} from './service/hooks/linking.hook.ts';
import {ToastComponent} from './components/styled/components/Toast.tsx';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';

Sentry.init({
  dsn: Config.SENTRY_DSN,
});

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#343666',
    accent: 'yellow',
    background: '#ffffff',
  },
};

function initializeRecoilState({set}: MutableSnapshot): void {
  const authToken = LocalStorage.get('authToken', 'json');
  if (authToken) {
    set(authState, {
      ...authToken,
      accessTokenExpireAt: new Date(authToken.accessTokenExpireAt),
      refreshTokenExpireAt: new Date(authToken.refreshTokenExpireAt),
    });
  }
}

const InternalApp = (): React.JSX.Element => {
  useFetchLocalStorageUserHero();

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
    hideSplash();
  }, []);

  const linking = useLinking();

  return (
    <RecoilRoot initializeState={initializeRecoilState}>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer linking={linking}>
          <InternalApp />
          <ToastComponent />
        </NavigationContainer>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
};

export default Sentry.wrap(App);
