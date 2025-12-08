import { useEffect } from 'react';
import { Linking } from 'react-native';
import type { LinkingOptions } from '@react-navigation/native';
import {
  APP_SCREENS,
  HERO_SETTING_SCREENS,
  ROOT_SCREENS,
} from '../../navigation/screens.constant';

const TRUSTED_PREFIXES = ['https://lifepuzzle.itmca.io', 'lifepuzzle://'];

/**
 * Validate shareKey parameter for security
 * - Must be alphanumeric with hyphens only
 * - Maximum length of 255 characters
 */
const validateShareKey = (shareKey: string): string => {
  if (!shareKey || typeof shareKey !== 'string') {
    return '';
  }

  // Allow alphanumeric characters and hyphens only, max 255 chars
  if (!/^[a-zA-Z0-9-]{1,255}$/.test(shareKey)) {
    return '';
  }

  return shareKey;
};

/**
 * Validate deep link URL is from trusted source
 */
const isValidDeepLinkUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  return TRUSTED_PREFIXES.some(prefix => url.startsWith(prefix));
};

export const useLinking = (): LinkingOptions<ReactNavigation.RootParamList> => {
  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      // Validate URL is from trusted source
      if (!isValidDeepLinkUrl(url)) {
        return;
      }
    };

    // 새로운 방식으로 이벤트 리스너 추가
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      // 구독 제거
      subscription.remove();
    };
  }, []);

  return {
    prefixes: TRUSTED_PREFIXES,

    config: {
      screens: {
        [ROOT_SCREENS.APP]: {
          screens: {
            [APP_SCREENS.HERO_SETTING_NAVIGATOR]: {
              screens: {
                [HERO_SETTING_SCREENS.HERO_SETTING]: {
                  path: 'share/hero',
                  parse: {
                    shareKey: (shareKey: string) => validateShareKey(shareKey),
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
