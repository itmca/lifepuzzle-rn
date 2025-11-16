import {useEffect, useState} from 'react';
import {Keyboard, KeyboardEvent} from 'react-native';

export interface KeyboardInfo {
  isVisible: boolean;
  height: number;
}

/**
 * 키보드 상태를 관리하는 Hook
 */
export const useKeyboard = (): KeyboardInfo => {
  const [keyboardInfo, setKeyboardInfo] = useState<KeyboardInfo>({
    isVisible: false,
    height: 0,
  });

  useEffect(() => {
    const onKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardInfo({
        isVisible: true,
        height: event.endCoordinates.height,
      });
    };

    const onKeyboardHide = () => {
      setKeyboardInfo({
        isVisible: false,
        height: 0,
      });
    };

    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      onKeyboardShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      onKeyboardHide,
    );

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  return keyboardInfo;
};
