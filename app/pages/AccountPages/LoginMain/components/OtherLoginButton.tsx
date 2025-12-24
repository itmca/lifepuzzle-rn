import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../../navigation/types';

import { Color } from '../../../../constants/color.constant';
import { ContentContainer } from '../../../../components/ui/layout/ContentContainer';
import { TouchableOpacity } from 'react-native';
import { BodyTextM } from '../../../../components/ui/base/TextBase';

const OtherLoginButton = (): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <ContentContainer alignCenter>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Auth', {
            screen: 'LoginRegisterNavigator',
            params: {
              screen: 'LoginOthers',
            },
          });
        }}
      >
        <BodyTextM color={Color.GREY_800} underline>
          다른 방법으로 로그인
        </BodyTextM>
      </TouchableOpacity>
    </ContentContainer>
  );
};

export { OtherLoginButton };
