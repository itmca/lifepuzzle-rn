import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SmallText} from '../styled/components/Text';
import {BasicNavigationProps} from '../../navigation/types';
import {StoryWritingParamList} from '../../navigation/no-tab/StoryWritingNavigator';

type Props = {
  text: string;
  nextScreenName?: keyof StoryWritingParamList;
  customAction?: Function;
};

const WritingHeaderRight = ({
  text,
  nextScreenName,
  customAction,
}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <Pressable
      onPress={() => {
        if (typeof customAction === 'function') {
          customAction();
        } else {
          navigation.push('NoTab', {
            screen: 'StoryWritingNavigator',
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
