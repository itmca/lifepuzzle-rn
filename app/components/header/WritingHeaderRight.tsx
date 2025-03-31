import React from 'react';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MediumText from '../styled/components/LegacyText.tsx';
import {BasicNavigationProps} from '../../navigation/types';
import {StoryWritingParamList} from '../../navigation/no-tab/StoryWritingNavigator';
import {Color, LegacyColor} from '../../constants/color.constant';
import {BodyTextB} from '../styled/components/Text.tsx';

type Props = {
  text: string;
  disable?: boolean;
  nextScreenName?: keyof StoryWritingParamList;
  customAction?: Function;
};

const WritingHeaderRight = ({
  text,
  disable = false,
  nextScreenName,
  customAction,
}: Props): JSX.Element => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <Pressable
      onPress={() => {
        if (disable) return;
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
      <BodyTextB color={disable ? Color.GREY_400 : Color.MAIN_DARK}>
        {text}
      </BodyTextB>
    </Pressable>
  );
};

export default WritingHeaderRight;
