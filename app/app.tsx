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
import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';
import {Linking} from 'react-native';
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
      <RootNavigator />
    </PaperProvider>
  );
};

const linking = {
  prefixes: ['https://lifepuzzle.itmca.io', 'lifepuzzle://'],

  config: {
    screens: {
      NoTab: {
        screens: {
          HeroSettingNavigator: {
            screens: {
              HeroSetting: {
                path: 'share/hero',
                parse: {
                  shareKey: shareKey => `${shareKey}`,
                },
              },
            },
          },
        },
      },
    },
  },
  subscribe(listener: (url: string) => void) {
    const onReceiveURL = ({url}: {url: string}) => {
      console.log('Received URL in subscribe:', url);
      listener(url);
    };

    // 새로운 방식으로 이벤트 리스너 추가
    const subscription = Linking.addEventListener('url', onReceiveURL);

    return () => {
      // 구독 제거
      subscription.remove();
    };
  },
  getInitialURL: async () => {
    const url = await Linking.getInitialURL();
    console.log('Initial URL:', url);
    return url;
  },
};

const App = (): React.JSX.Element => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const handleDeepLink = ({url}: {url: string}) => {
      console.log('Handling deep link:', url);
      // 여기에 필요한 처리 로직 추가
    };

    // 새로운 방식으로 이벤트 리스너 추가
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      // 구독 제거
      subscription.remove();
    };
  }, []);

  return (
    <RecoilRoot initializeState={initializeRecoilState}>
      <GestureHandlerRootView flex={1}>
        <NavigationContainer linking={linking}>
          <InternalApp />
        </NavigationContainer>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
};

export default Sentry.wrap(App);
