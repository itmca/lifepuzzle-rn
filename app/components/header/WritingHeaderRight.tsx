import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MediumText from '../styled/components/LegacyText.tsx';
import {BasicNavigationProps} from '../../navigation/types';
import {StoryWritingParamList} from '../../navigation/no-tab/StoryWritingNavigator';
import {Color} from '../../constants/color.constant';

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
      <MediumText fontWeight={600} color={Color.PRIMARY_LIGHT}>
        {text}
      </MediumText>
    </Pressable>
  );
};

export default WritingHeaderRight;
