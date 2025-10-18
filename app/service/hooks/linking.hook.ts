import {useEffect} from 'react';
import {Linking} from 'react-native';
import type {LinkingOptions} from '@react-navigation/native/lib/typescript/src/types';

export const useLinking = (): LinkingOptions<ReactNavigation.RootParamList> => {
  useEffect(() => {
    const handleDeepLink = ({url}: {url: string}) => {
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
            StoryWritingNavigator: {
              screens: {
                FacebookPhotoSelector: {
                  path: 'facebook/photos',
                  parse: {
                    code: code => `${code}`,
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
