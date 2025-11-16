import {useState, useEffect} from 'react';
import {Dimensions, ScaledSize} from 'react-native';

export interface ScreenDimensions {
  window: ScaledSize;
  screen: ScaledSize;
  isLandscape: boolean;
  isTablet: boolean;
}

/**
 * 화면 크기와 방향을 관리하는 Hook
 */
export const useScreen = (): ScreenDimensions => {
  const [dimensions, setDimensions] = useState(() => {
    const window = Dimensions.get('window');
    const screen = Dimensions.get('screen');

    return {
      window,
      screen,
      isLandscape: window.width > window.height,
      isTablet: Math.min(window.width, window.height) >= 768,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({
          window,
          screen,
          isLandscape: window.width > window.height,
          isTablet: Math.min(window.width, window.height) >= 768,
        });
      },
    );

    return () => subscription?.remove();
  }, []);

  return dimensions;
};
