import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BasicNavigationProps } from '../../../../navigation/types.tsx';
import { ContentContainer } from '../../layout/ContentContainer';
import { SvgIcon } from '../../display/SvgIcon.tsx';

const HeroSettingRightHeader = (): React.ReactElement => {
  const navigation = useNavigation<BasicNavigationProps>();
  return (
    <ContentContainer alignCenter width={'auto'}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('App', {
            screen: 'HeroSettingNavigator',
            params: {
              screen: 'HeroRegister',
            },
          });
        }}
      >
        <SvgIcon name={'heroAdd'} />
      </TouchableOpacity>
    </ContentContainer>
  );
};

export { HeroSettingRightHeader };
