import React from 'react';
import {Pressable, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import { SmallText } from '../styled/components/Text';

type Props = {
  text: string;
  nextScreenName?: string;
  customAction?: Function;
};

const WritingHeaderRight = ({
  text,
  nextScreenName,
  customAction,
}: Props): JSX.Element => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => {
        if (typeof customAction === 'function') {
          customAction();
        } else {
          navigation.push('NoTab', {
            screen: 'PuzzleWritingNavigator',
            params: {
              screen: nextScreenName,
            },
          });
        }
      }}>
      <SmallText color={'#55A5FD'}>{text}</SmallText>
    </Pressable>
  );
};

export default WritingHeaderRight;
