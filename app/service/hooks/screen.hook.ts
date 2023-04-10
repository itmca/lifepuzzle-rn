import {useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';

export const useFocusAction = (onFocus: () => void) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    onFocus();
  }, [isFocused]);
};
