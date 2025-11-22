import { useEffect } from 'react';
import { Linking } from 'react-native';
import type { LinkingOptions } from '@react-navigation/native';
import {
  ROOT_SCREENS,
  APP_SCREENS,
  HERO_SETTING_SCREENS,
} from '../../navigation/screens.constant';

export const useLinking = (): LinkingOptions<ReactNavigation.RootParamList> => {
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      // 여기에 필요한 처리 로직 추가
    };

    // 새로운 방식으로 이벤트 리스너 추가
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      // 구독 제거
      subscription.remove();
    };
  }, []);

  return {
    prefixes: ['https://lifepuzzle.itmca.io', 'lifepuzzle://'],

    config: {
      screens: {
        [ROOT_SCREENS.APP]: {
          screens: {
            [APP_SCREENS.HERO_SETTING_NAVIGATOR]: {
              screens: {
                [HERO_SETTING_SCREENS.HERO_SETTING]: {
                  path: 'share/hero',
                  parse: {
                    shareKey: (shareKey: string) => `${shareKey}`,
                  },
                },
              },
            },
          },
        },
      },
    },
    subscribe(listener: (url: string) => void) {
      const onReceiveURL = ({ url }: { url: string }) => {
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
      return url;
    },
  };
};
