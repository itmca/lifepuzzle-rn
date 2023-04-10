/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './navigation/RootNavigator';
import {LoadingContainer} from './components/loadding/LoadingContainer';
import {useFetchLocalStorageUserHero} from './service/hooks/local-storage.hook';
import {MutableSnapshot, RecoilRoot} from 'recoil';
import {LocalStorage} from './service/local-storage.service';
import {authState} from './recoils/auth.recoil';
import {NavigationContainer} from '@react-navigation/native';

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

const InternalApp = (): JSX.Element => {
  const [isLoading] = useFetchLocalStorageUserHero();

  return (
    <PaperProvider theme={theme}>
      <LoadingContainer isLoading={isLoading}>
        <RootNavigator />
      </LoadingContainer>
    </PaperProvider>
  );
};

const App = (): JSX.Element => {
  return (
    <RecoilRoot initializeState={initializeRecoilState}>
      <NavigationContainer>
        <InternalApp />
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
