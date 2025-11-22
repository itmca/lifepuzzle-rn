import React from 'react';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../../navigation/types';
import { StoryWritingParamList } from '../../../../navigation/app/StoryWritingNavigator';
import { Color } from '../../../../constants/color.constant';
import { BodyTextB } from '../../base/TextBase';

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
}: Props): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <Pressable
      onPress={() => {
        if (disable) {
          return;
        }
        if (typeof customAction === 'function') {
          customAction();
        } else if (nextScreenName) {
          navigation.push('App', {
            screen: 'StoryWritingNavigator',
            params: {
              screen: nextScreenName,
            },
          });
        }
      }}
    >
      <BodyTextB color={disable ? Color.GREY_400 : Color.MAIN_DARK}>
        {text}
      </BodyTextB>
    </Pressable>
  );
};

export default WritingHeaderRight;
