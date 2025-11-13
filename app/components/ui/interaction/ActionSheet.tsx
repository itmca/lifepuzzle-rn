import {useCallback} from 'react';
import {useActionSheet} from '@expo/react-native-action-sheet';

interface Option {
  label: string;
  value: string;
  onSelect: (value: string) => void;
}

interface Props {
  title?: string;
  message?: string;
  options: Option[];
}

export const useCommonActionSheet = ({title, message, options}: Props) => {
  const {showActionSheetWithOptions} = useActionSheet();

  const showActionSheet = useCallback(() => {
    const labels = options.map(opt => opt.label);
    const cancelButtonIndex = labels.length;

    showActionSheetWithOptions(
      {
        options: [...labels, '닫기'],
        cancelButtonIndex,
        destructiveButtonIndex: options.length - 1,
        title,
        message,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex !== undefined && buttonIndex < options.length) {
          options[buttonIndex].onSelect(options[buttonIndex].value);
        }
      },
    );
  }, [options, title, message]);

  return {showActionSheet};
};
