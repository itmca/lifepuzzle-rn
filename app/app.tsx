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
import {AppState} from 'react-native';
import RootNavigator from './navigation/RootNavigator';
import {useFetchLocalStorageUserHero} from './service/hooks/local-storage.hook';
import {MutableSnapshot, RecoilRoot} from 'recoil';
import {LocalStorage} from './service/local-storage.service';
import {authState} from './recoils/auth.recoil';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {hideSplash, showSplash} from 'react-native-splash-view';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useLinking} from './service/hooks/linking.hook.ts';
import {ToastComponent} from './components/styled/components/Toast.tsx';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import ShareModule from '../src/NativeLPShareModule';
import {useSetRecoilState} from 'recoil';
import {sharedImageDataState} from './recoils/share.recoil';
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
  const navigation = useNavigation<BasicNavigationProps>();
  const setSharedImageData = useSetRecoilState(sharedImageDataState);

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

    setTimeout(() => {
      hideSplash(); // Hide after some time
    }, 2000);
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

export default App;
