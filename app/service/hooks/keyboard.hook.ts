import {useState, useEffect, useCallback} from 'react';
import {Keyboard, KeyboardEventListener} from 'react-native';

export const useKeyboardVisible = (): boolean => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const handleKeyboardShow = useCallback(() => {
    setKeyboardVisible(true);
  }, []);

  const handleKeyboardHide = useCallback(() => {
    setKeyboardVisible(false);
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      handleKeyboardShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide,
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return isKeyboardVisible;
};
